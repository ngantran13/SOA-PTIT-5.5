# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
# Cài đặt dependencies chỉ dành cho production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM base AS build
# Cài đặt tất cả dependencies (bao gồm devDependencies để build)
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng Next.js
RUN npm run build

FROM base AS final
ENV NODE_ENV=production

# Sử dụng user node
USER node

# Sao chép các tệp cần thiết
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
# Sao chép thư mục public nếu dự án có sử dụng
COPY --from=build /usr/src/app/public ./public
# Đảm bảo quyền ghi cho thư mục .next
COPY --from=build --chown=node:node /usr/src/app/.next ./.next

EXPOSE 3000

# Chạy ở chế độ sản xuất
CMD ["npm", "run", "start"]