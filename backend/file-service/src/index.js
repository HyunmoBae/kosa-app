const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fileRoutes = require('./routes/file.routes');
const path = require('path');
const fs = require('fs').promises;
require("dotenv").config(); // .env 파일 로드

const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// 환경 변수 설정
const PORT = process.env.PORT;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_DB}`;
const FILE_STORAGE_PATH = process.env.UPLOAD_DIR; // NFS 경로로 변경


if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 업로드 디렉토리 생성
async function ensureUploadDirectory() {
  try {
    await fs.access(FILE_STORAGE_PATH);
  } catch (error) {
    await fs.mkdir(FILE_STORAGE_PATH, { recursive: true });
    console.log('📂 업로드 디렉토리가 생성되었습니다:', FILE_STORAGE_PATH);
  }
}

// 데이터베이스 연결 (자동 재연결)
const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log(`✅ Connected to MongoDB at ${MONGODB_URI}`))
  .catch((error) => {
    console.error("❌ MongoDB 연결 실패:", error);
    console.log("⏳ 5초 후 다시 연결을 시도합니다...");
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// MongoDB 연결 이벤트 리스너
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB 연결 에러:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB 연결이 끊어졌습니다. 재연결을 시도합니다.');
  connectWithRetry();
});

// 업로드 디렉토리 확인
ensureUploadDirectory()
  .then(() => console.log('📂 업로드 디렉토리가 준비되었습니다.'))
  .catch((error) => {
    console.error('❌ 업로드 디렉토리 생성 실패:', error);
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
  console.error("❌ 서버 오류:", err.stack);
  res.status(500).json({ 
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 서버 시작
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 File Service is running on port ${PORT}`);
});
