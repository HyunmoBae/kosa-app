const Todo = require('../models/todo.model');

exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
    res.json({ message: '할 일이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 