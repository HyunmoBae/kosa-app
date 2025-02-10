import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardListIcon,
  DocumentTextIcon,
  FolderIcon,
  ChartPieIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    todos: {
      total: 0,
      completed: 0,
      urgent: 0,
    },
    boards: {
      total: 0,
      categories: {},
      recent: [],
    },
    files: {
      total: 0,
      totalSize: 0,
      categories: {},
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [todosRes, boardsRes, filesRes] = await Promise.all([
        axios.get('/api/todos'),
        axios.get('/api/boards'),
        axios.get('/api/files'),
      ]);

      const todos = todosRes.data;
      const boards = boardsRes.data;
      const files = filesRes.data;

      setStats({
        todos: {
          total: todos.length,
          completed: todos.filter(todo => todo.completed).length,
          urgent: todos.filter(todo => todo.priority === '높음' && !todo.completed).length,
        },
        boards: {
          total: boards.length,
          categories: boards.reduce((acc, board) => {
            acc[board.category] = (acc[board.category] || 0) + 1;
            return acc;
          }, {}),
          recent: boards.slice(0, 5),
        },
        files: {
          total: files.length,
          totalSize: files.reduce((acc, file) => acc + file.size, 0),
          categories: files.reduce((acc, file) => {
            acc[file.category] = (acc[file.category] || 0) + 1;
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      console.error('통계 정보를 불러오는데 실패했습니다:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">할 일</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todos.total}</p>
            </div>
            <ClipboardListIcon className="h-12 w-12 text-primary-500" />
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              완료: {stats.todos.completed}
            </div>
            <div className="flex items-center text-red-600">
              <ExclamationIcon className="h-4 w-4 mr-1" />
              긴급: {stats.todos.urgent}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">게시글</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.boards.total}</p>
            </div>
            <DocumentTextIcon className="h-12 w-12 text-primary-500" />
          </div>
          <div className="mt-4 space-x-2">
            {Object.entries(stats.boards.categories).map(([category, count]) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {category}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">파일</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.files.total}</p>
            </div>
            <FolderIcon className="h-12 w-12 text-primary-500" />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            총 용량: {formatFileSize(stats.files.totalSize)}
          </div>
        </div>
      </div>

      {/* 최근 게시글 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">최근 게시글</h2>
          <Link
            to="/boards"
            className="text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            모두 보기
          </Link>
        </div>
        <div className="divide-y">
          {stats.boards.recent.map((board) => (
            <div key={board._id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{board.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{board.content}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 파일 카테고리 분포 */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">파일 카테고리 분포</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.files.categories).map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <ChartPieIcon className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">{category}</span>
              </div>
              <span className="text-sm text-gray-600">{count}개</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 