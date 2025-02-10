const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const app = express();

// 로그 디렉토리 생성
const logDir = path.join(__dirname, '../logs');
require('fs').mkdirSync(logDir, { recursive: true });

// 로그 포맷 설정
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// 로거 설정
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: process.env.LOG_MAX_SIZE || '10m',
      maxFiles: process.env.LOG_MAX_FILES || '7d',
      zippedArchive: true
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: process.env.LOG_MAX_SIZE || '10m',
      maxFiles: process.env.LOG_MAX_FILES || '7d',
      zippedArchive: true
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 로깅 미들웨어
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });
  next();
});

// 프록시 설정
const TODO_SERVICE = process.env.TODO_SERVICE_URL || 'http://todo-service:3000';
const BOARD_SERVICE = process.env.BOARD_SERVICE_URL || 'http://board-service:3000';
const FILE_SERVICE = process.env.FILE_SERVICE_URL || 'http://file-service:3000';

// 프록시 에러 핸들러
const handleProxyError = (err, res, next) => {
  logger.error('Proxy Error:', err);
  if (err && err.code === 'ECONNREFUSED') {
    res.status(503).json({ message: '서비스를 사용할 수 없습니다.' });
  } else {
    res.status(500).json({ message: '내부 서버 오류가 발생했습니다.' });
  }
};

// 프록시 옵션
const proxyOptions = {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['x-forwarded-for'] = srcReq.ip;
    proxyReqOpts.headers['x-forwarded-proto'] = srcReq.protocol;
    proxyReqOpts.headers['x-forwarded-host'] = srcReq.get('host');
    return proxyReqOpts;
  },
  proxyErrorHandler: handleProxyError,
  parseReqBody: true,
  timeout: parseInt(process.env.PROXY_TIMEOUT) || 30000,
  proxyTimeout: parseInt(process.env.PROXY_TIMEOUT) || 30000,
  retry: (err, res) => {
    if (err) {
      logger.warn(`프록시 요청 실패, 재시도 중: ${err.message}`);
      return true; // 에러 발생 시 재시도
    }
    return false; // 응답이 있으면 재시도하지 않음
  },
  retryDelay: 1000, // 재시도 간격 (1초)
  maxRetries: 3, // 최대 재시도 횟수
};

// 라우트 설정
app.use('/api/todos', proxy(TODO_SERVICE, {
  ...proxyOptions,
  proxyReqPathResolver: (req) => `/api/todos${req.url}`
}));

app.use('/api/boards', proxy(BOARD_SERVICE, {
  ...proxyOptions,
  proxyReqPathResolver: (req) => `/api/boards${req.url}`
}));

app.use('/api/files', proxy(FILE_SERVICE, {
  ...proxyOptions,
  proxyReqPathResolver: (req) => `/api/files${req.url}`,
  parseReqBody: false,
  limit: '10mb'
}));

// 헬스 체크
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Gateway 서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 