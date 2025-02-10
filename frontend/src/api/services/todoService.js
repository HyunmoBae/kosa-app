import api from '../axios';

const todoService = {
  // 모든 할 일 목록 조회
  getAllTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      throw new Error('할 일 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 할 일 조회
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('할 일을 불러오는데 실패했습니다.');
    }
  },

  // 새로운 할 일 생성
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      throw new Error('할 일을 생성하는데 실패했습니다.');
    }
  },

  // 할 일 수정
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw new Error('할 일을 수정하는데 실패했습니다.');
    }
  },

  // 할 일 삭제
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('할 일을 삭제하는데 실패했습니다.');
    }
  },

  // 할 일 완료 상태 토글
  toggleTodoComplete: async (id, completed) => {
    try {
      const response = await api.put(`/todos/${id}`, { completed });
      return response.data;
    } catch (error) {
      throw new Error('할 일 상태 변경에 실패했습니다.');
    }
  },
};

export default todoService; 