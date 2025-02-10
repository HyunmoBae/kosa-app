import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://gateway-service:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 전 처리
    if (config.url.includes('/files') && config.method === 'post') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 에러 응답 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('Response Error:', error.response.data);
      const { status } = error.response;
      if (status === 500) {
        console.error('서버 내부 오류가 발생했습니다.');
      } else if (status === 400) {
        console.error('잘못된 요청입니다.');
      } else if (status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.');
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.error('서버와 통신할 수 없습니다:', error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('요청 설정 중 오류 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 