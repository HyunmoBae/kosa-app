import api from '../axios';

const boardService = {
  // 모든 게시글 조회
  getAllPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error('게시글 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 게시글 조회
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('게시글을 불러오는데 실패했습니다.');
    }
  },

  // 새로운 게시글 생성
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw new Error('게시글 작성에 실패했습니다.');
    }
  },

  // 게시글 수정
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw new Error('게시글 수정에 실패했습니다.');
    }
  },

  // 게시글 삭제
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('게시글 삭제에 실패했습니다.');
    }
  },

  // 카테고리별 게시글 조회
  getPostsByCategory: async (category) => {
    try {
      const response = await api.get(`/posts/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error('카테고리별 게시글 조회에 실패했습니다.');
    }
  },

  // 태그로 게시글 검색
  searchPostsByTags: async (tags) => {
    try {
      const response = await api.get('/posts/search', { params: { tags } });
      return response.data;
    } catch (error) {
      throw new Error('태그 검색에 실패했습니다.');
    }
  }
};

export default boardService; 