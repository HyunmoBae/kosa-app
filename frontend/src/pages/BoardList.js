import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  TagIcon,
  ClockIcon,
  FolderIcon
} from '@heroicons/react/outline';
import axios from 'axios';

function BoardList() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '일상',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/boards');
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleOpen = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        category: '일상',
        tags: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
    setTagInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`/api/boards/${editingPost._id}`, formData);
      } else {
        await axios.post('/api/boards', formData);
      }
      fetchPosts();
      handleClose();
    } catch (error) {
      console.error('게시글 저장에 실패했습니다:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/boards/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('게시글 삭제에 실패했습니다:', error);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...new Set([...formData.tags, tagInput.trim()])],
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '일상':
        return 'bg-blue-100 text-blue-800';
      case '메모':
        return 'bg-green-100 text-green-800';
      case '아이디어':
        return 'bg-purple-100 text-purple-800';
      case '할일':
        return 'bg-yellow-100 text-yellow-800';
      case '프로젝트':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        <button
          onClick={() => handleOpen()}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          새 게시글
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleOpen(post)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  수정
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-600 hover:text-red-900 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingPost ? '게시글 수정' : '새 게시글'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  카테고리
                </label>
                <select
                  className="input mt-1"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="일상">일상</option>
                  <option value="메모">메모</option>
                  <option value="아이디어">아이디어</option>
                  <option value="할일">할일</option>
                  <option value="프로젝트">프로젝트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <textarea
                  className="input mt-1"
                  rows="8"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  태그
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  placeholder="Enter를 눌러 태그 추가"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleAddTag}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(tag)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default BoardList; 