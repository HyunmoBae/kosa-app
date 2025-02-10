import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '보통',
    dueDate: '',
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('할 일 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleOpen = (todo = null) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: '',
        description: '',
        priority: '보통',
        dueDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await axios.put(`/api/todos/${editingTodo._id}`, formData);
      } else {
        await axios.post('/api/todos', formData);
      }
      fetchTodos();
      handleClose();
    } catch (error) {
      console.error('할 일 저장에 실패했습니다:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('할 일 삭제에 실패했습니다:', error);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await axios.put(`/api/todos/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error('할 일 상태 변경에 실패했습니다:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '높음':
        return 'text-red-600';
      case '보통':
        return 'text-yellow-600';
      case '낮음':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">할 일 목록</h1>
        <button
          onClick={() => handleOpen()}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          새 할 일
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="p-4 flex items-center hover:bg-gray-50 transition-colors duration-150"
          >
            <button
              onClick={() => handleToggle(todo)}
              className="flex-shrink-0 mr-3"
            >
              {todo.completed ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-gray-300" />
              )}
            </button>
            <div className="flex-grow">
              <h3
                className={`text-lg font-medium ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span className={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </span>
                {todo.dueDate && (
                  <span>
                    마감일: {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <button
                onClick={() => handleOpen(todo)}
                className="text-gray-400 hover:text-gray-500 mr-2"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="text-red-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
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

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingTodo ? '할 일 수정' : '새 할 일'}
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
                  설명
                </label>
                <textarea
                  className="input mt-1"
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  우선순위
                </label>
                <select
                  className="input mt-1"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="낮음">낮음</option>
                  <option value="보통">보통</option>
                  <option value="높음">높음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  마감일
                </label>
                <input
                  type="date"
                  className="input mt-1"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
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

export default TodoList; 