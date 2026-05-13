# Stage 1: Build da aplicação React
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_LOAD_BALANCER_URL=http://localhost:8080
ENV REACT_APP_LOAD_BALANCER_URL=$REACT_APP_LOAD_BALANCER_URL
RUN npm run build

# Stage 2: Servir com NGINX
FROM nginx:1.27-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
