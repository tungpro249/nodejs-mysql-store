# Sử dụng hình ảnh Node.js 14 làm cơ sở
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn vào thư mục làm việc
COPY . .

# Cài đặt môi trường sản xuất
ENV NODE_ENV production

# Khởi động dịch vụ MySQL
RUN apt-get update && apt-get install -y mysql-server

# Cài đặt cơ sở dữ liệu
ENV MYSQL_ROOT_PASSWORD=tungpro249
ENV MYSQL_DATABASE=testdb
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=tungpro249

# Khởi động dịch vụ Node.js
CMD ["npm", "start"]