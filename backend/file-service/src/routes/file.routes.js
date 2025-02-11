const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/file.controller');

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_DIR || "/mnt/nfs/uploads"; // NFS 경로로 변경
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // 디렉토리가 없으면 생성
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 제한
  }
});

// 파일 업로드
router.post('/', upload.single('file'), fileController.uploadFile);

// 모든 파일 조회
router.get('/', fileController.getAllFiles);

// 특정 파일 조회
router.get('/:id', fileController.getFileById);

// 파일 다운로드
router.get('/:id/download', fileController.downloadFile);

// 파일 정보 수정
router.put('/:id', fileController.updateFileInfo);

// 파일 삭제
router.delete('/:id', fileController.deleteFile);

module.exports = router; 