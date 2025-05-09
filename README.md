# TOIEC Web Page - Triển khai trên server Ubuntu

Đây là dự án [Next.js](https://nextjs.org) sử dụng PostgreSQL và Prisma. Dưới đây là hướng dẫn chi tiết để triển khai ứng dụng trên máy chủ Ubuntu.

---

## 1. Cài đặt Node.js và npm

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v   # kiểm tra version, nên >= 18
npm -v
```
Nếu version Node.js thấp, nên cài Node.js mới từ NodeSource:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 2. Cài đặt PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Tạo database và user
```bash
sudo -u postgres psql
```
Trong giao diện psql:
```sql
CREATE DATABASE toiecdb;
CREATE USER toiecuser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE toiecdb TO toiecuser;
\q
```

### Cập nhật biến môi trường
Chỉnh file `.env` hoặc `.env.local`:
```
DATABASE_URL="postgresql://toiecuser:yourpassword@localhost:5432/toiecdb"
```

---

## 3. Clone mã nguồn và cài dependencies

```bash
git clone <link-repo-cua-ban>
cd toiec-web-page
npm install
```

Copy file `.env.local` từ máy local lên server (nếu có) và chỉnh sửa cho phù hợp.

---

## 4. Build và migrate database

```bash
npm run build
npx prisma migrate deploy
```
Hoặc nếu lần đầu:
```bash
npx prisma migrate dev
```

---

## 5. Chạy ứng dụng production

```bash
npm start
```
Mặc định app chạy ở cổng 3000: http://<ip-server>:3000

---

## 6. (Khuyến nghị) Chạy nền bằng PM2

```bash
npm install -g pm2
pm2 start npm --name "toiec-web-page" -- start
pm2 save
pm2 startup
```

---

## 7. Troubleshooting
- Kiểm tra biến môi trường, đặc biệt là `DATABASE_URL`.
- Kiểm tra quyền truy cập database.
- Xem log bằng `pm2 logs` hoặc kiểm tra lỗi khi chạy `npm start`.

---

## Tham khảo
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

Nếu gặp lỗi hoặc cần hỗ trợ, hãy gửi log hoặc mô tả lỗi để được trợ giúp!
