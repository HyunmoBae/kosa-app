import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  PlusIcon, 
  TrashIcon, 
  DownloadIcon,
  DocumentIcon,
  PhotographIcon,
  DocumentTextIcon,
  ClockIcon,
  FolderIcon
} from '@heroicons/react/outline';
import axios from 'axios';

function FileManager() {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: '기타',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('파일 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const fileData = new FormData();
    fileData.append('file', selectedFile);
    fileData.append('description', formData.description);
    fileData.append('category', formData.category);

    try {
      await axios.post('/api/files', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchFiles();
      handleClose();
    } catch (error) {
      console.error('파일 업로드에 실패했습니다:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`);
      fetchFiles();
    } catch (error) {
      console.error('파일 삭제에 실패했습니다:', error);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`/api/files/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('파일 다운로드에 실패했습니다:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setFormData({
      description: '',
      category: '기타',
    });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return <PhotographIcon className="h-12 w-12 text-blue-500" />;
    } else if (mimetype.startsWith('text/')) {
      return <DocumentTextIcon className="h-12 w-12 text-green-500" />;
    } else {
      return <DocumentIcon className="h-12 w-12 text-gray-500" />;
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">파일 관리자</h1>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          파일 업로드
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <div key={file._id} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                {getFileIcon(file.mimetype)}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {file.originalname}
                </h3>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              {file.description && (
                <p className="text-gray-600 text-sm mb-4">{file.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <FolderIcon className="h-4 w-4 mr-1" />
                  {file.category}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleDownload(file._id, file.originalname)}
                  className="text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  다운로드
                </button>
                <button
                  onClick={() => handleDelete(file._id)}
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

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              파일 업로드
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  파일
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  className="input mt-1"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
                  <option value="문서">문서</option>
                  <option value="이미지">이미지</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedFile}
                >
                  업로드
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default FileManager; 