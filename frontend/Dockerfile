FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# 如果是 Vite 構建，通常是 npm run build 或 yarn build
# 注意：在生產環境中，您可能希望由 Nginx 直接提供靜態文件，而不是讓 Node.js 服務
RUN yarn build

EXPOSE 5173 # 或者您實際的前端服務端口
CMD ["yarn", "preview"] # 或者您實際的啟動命令
