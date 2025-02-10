import api from '../axios';

const fileService = {
  // 모든 파일 목록 조회
  getAllFiles: async (params = {}) => {
    try {
      const response = await api.get('/files', { params });
      return response.data;
    } catch (error) {
      throw new Error('파일 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 파일 정보 조회
  getFileById: async (id) => {
    try {
      const response = await api.get(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('파일 정보를 불러오는데 실패했습니다.');
    }
  },

  // 파일 업로드
  uploadFile: async (formData) => {
    try {
      const response = await api.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('파일 업로드에 실패했습니다.');
    }
  },

  // 파일 삭제
  deleteFile: async (id) => {
    try {
      const response = await api.delete(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('파일 삭제에 실패했습니다.');
    }
  },

  // 파일 다운로드
  downloadFile: async (id) => {
    try {
      const response = await api.get(`/files/${id}/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw new Error('파일 다운로드에 실패했습니다.');
    }
  },

  // 카테고리별 파일 조회
  getFilesByCategory: async (category) => {
    try {
      const response = await api.get('/files', {
        params: { category },
      });
      return response.data;
    } catch (error) {
      throw new Error('카테고리별 파일 조회에 실패했습니다.');
    }
  },

  // 파일 정보 업데이트
  updateFileInfo: async (id, fileData) => {
    try {
      const response = await api.put(`/files/${id}`, fileData);
      return response.data;
    } catch (error) {
      throw new Error('파일 정보 업데이트에 실패했습니다.');
    }
  }
};

export default fileService; 