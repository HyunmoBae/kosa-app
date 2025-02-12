const Board = require('../models/board.model');

exports.createPost = async (req, res) => {
  try {
    const board = new Board(req.body);
    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { category, tag } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    
    const boards = await Board.find(query).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!board) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 