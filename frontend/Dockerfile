# 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 캐시 활용을 위해 package.json과 package-lock.json만 먼저 복사
COPY package*.json ./

# 의존성 설치 (clean install)
RUN npm ci --silent

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# 실행 스테이지
FROM nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 nginx로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 보안을 위해 root 대신 nginx 사용자로 실행
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# 80 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"] 