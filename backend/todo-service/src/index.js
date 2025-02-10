const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const todoRoutes = require('./routes/todo.routes');

const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// 환경 변수 설정
const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://192.168.0.138:27017/todo_db';  // 프로덕션용 URI
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 데이터베이스 연결
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('MongoDB에 연결되었습니다.'))
  .catch((error) => console.error('MongoDB 연결 실패:', error));

// 라우트 설정
app.use('/api/todos', todoRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 