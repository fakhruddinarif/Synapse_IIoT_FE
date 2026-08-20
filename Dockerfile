# ---------------------------------------------------------------------------
# Build SPA statis, lalu layani lewat nginx.
#
# Berbeda dari image lama yang menjalankan `react-router-serve`: setelah migrasi
# ke Vite SPA tidak ada lagi server render — hasil build hanyalah berkas statis,
# dan menjalankan Node hanya untuk mengirimkannya berarti menyalakan runtime
# tambahan di perangkat gateway yang sumber dayanya terbatas.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# VITE_* dibaca saat build, bukan saat runtime — nilainya ikut tertanam ke bundel.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
