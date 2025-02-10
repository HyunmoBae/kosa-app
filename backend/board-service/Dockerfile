# 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 캐시 활용을 위해 package.json과 package-lock.json만 먼저 복사
COPY package*.json ./

# 의존성 설치 (clean install, 개발 의존성 제외)
RUN npm install --production --silent

# 소스 코드 복사
COPY . .

# 실행 스테이지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 의존성과 소스 코드 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# 로그 디렉토리 생성
RUN mkdir -p /app/logs && \
    chown -R node:node /app

# 보안을 위해 node 사용자로 전환
USER node

# 헬스체크를 위한 3000 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "src/index.js"] 