# 베이스 이미지 선택
FROM node:18-alpine

# 필요한 시스템 패키지 설치
RUN apk add --no-cache tini

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 캐시 활용을 위해 package.json과 package-lock.json만 먼저 복사
COPY package*.json ./

# 의존성 설치 (clean install)
RUN npm install --silent

# 소스 코드 복사
COPY . .

# 파일 업로드 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/uploads && \
    chown -R node:node /app

# 보안을 위해 node 사용자로 전환
USER node

# 볼륨 마운트 포인트 설정
VOLUME ["/app/uploads"]

# 3000 포트 노출
EXPOSE 3000

# Tini를 사용하여 프로세스 관리
ENTRYPOINT ["/sbin/tini", "--"]

# 애플리케이션 실행
CMD ["node", "src/index.js"] 