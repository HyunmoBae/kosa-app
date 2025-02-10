const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board.controller');

// 모든 게시글 조회 (카테고리나 태그로 필터링 가능)
router.get('/', boardController.getAllPosts);

// 새로운 게시글 생성
router.post('/', boardController.createPost);

// 특정 게시글 조회
router.get('/:id', boardController.getPostById);

// 게시글 수정
router.put('/:id', boardController.updatePost);

// 게시글 삭제
router.delete('/:id', boardController.deletePost);

module.exports = router; 