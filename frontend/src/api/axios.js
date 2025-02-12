import axios from 'axios';

// 글로벌 axios 기본 설정
axios.defaults.timeout = 30000;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// 글로벌 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    if (config.url.includes('/files') && config.method === 'post') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 500:
          console.error('서버 내부 오류가 발생했습니다.');
          break;
        case 400:
          console.error('잘못된 요청입니다.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        default:
          console.error('오류가 발생했습니다:', error.response.data);
      }
    } else if (error.request) {
      console.error('서버와 통신할 수 없습니다:', error.request);
    } else {
      console.error('요청 설정 중 오류 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axios; 
