const File = require('../models/file.model');
const path = require('path');
const fs = require('fs').promises;

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      category: req.body.category || '기타',
      description: req.body.description
    });

    const savedFile = await file.save();
    res.status(201).json(savedFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    const files = await File.find(query).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });
    }

    res.download(file.path, file.originalname);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });
    }

    // 실제 파일 삭제
    await fs.unlink(file.path);
    
    // DB에서 파일 정보 삭제
    await File.findByIdAndDelete(req.params.id);
    
    res.json({ message: '파일이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFileInfo = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        description: req.body.description
      },
      { new: true, runValidators: true }
    );
    
    if (!file) {
      return res.status(404).json({ message: '파일을 찾을 수 없습니다.' });
    }
    
    res.json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 