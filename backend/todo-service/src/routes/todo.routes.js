const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// 모든 할 일 목록 조회
router.get('/', todoController.getAllTodos);

// 새로운 할 일 생성
router.post('/', todoController.createTodo);

// 특정 할 일 조회
router.get('/:id', todoController.getTodoById);

// 할 일 수정
router.put('/:id', todoController.updateTodo);

// 할 일 삭제
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 