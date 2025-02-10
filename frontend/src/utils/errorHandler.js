export const handleApiError = (error) => {
  if (error.response) {
    // 서버가 응답을 반환한 경우
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500:
        return '서버 내부 오류가 발생했습니다.';
      default:
        return data.message || '알 수 없는 오류가 발생했습니다.';
    }
  } else if (error.request) {
    // 요청이 전송되었으나 응답을 받지 못한 경우
    return '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.';
  } else {
    // 요청 설정 중 에러가 발생한 경우
    return '요청을 처리하는 중 오류가 발생했습니다.';
  }
};

export const showErrorNotification = (message) => {
  // 향후 토스트 알림 등으로 확장 가능
  console.error(message);
  alert(message);
}; 