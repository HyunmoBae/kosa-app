const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fileRoutes = require('./routes/file.routes');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// 환경 변수 설정
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const FILE_STORAGE_PATH = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

if (!MONGODB_URI) {
  console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 업로드 디렉토리 생성
async function ensureUploadDirectory() {
  try {
    await fs.access(FILE_STORAGE_PATH);
  } catch (error) {
    await fs.mkdir(FILE_STORAGE_PATH, { recursive: true });
    console.log('업로드 디렉토리가 생성되었습니다:', FILE_STORAGE_PATH);
  }
}

// 데이터베이스 연결
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB에 연결되었습니다.'))
.catch((error) => {
  console.error('MongoDB 연결 실패:', error);
  process.exit(1);
});

// MongoDB 연결 이벤트 리스너
mongoose.connection.on('error', err => {
  console.error('MongoDB 연결 에러:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB 연결이 끊어졌습니다. 재연결을 시도합니다.');
});

// 업로드 디렉토리 확인
ensureUploadDirectory()
  .then(() => console.log('업로드 디렉토리가 준비되었습니다.'))
  .catch((error) => {
    console.error('업로드 디렉토리 생성 실패:', error);
    process.exit(1);
  });

// 라우트 설정
app.use('/api/files', fileRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  res.status(500).json({ 
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 