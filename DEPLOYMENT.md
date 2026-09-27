# 🚀 Hướng Dẫn Chi Tiết Triển Khai (Deploy) React App Lên VPS Linux (Ubuntu / Debian)

Tài liệu này sẽ hướng dẫn bạn từng bước từ lúc có source code React này cho đến khi trang web chạy trực tuyến trên máy chủ VPS của bạn.

---

## 📋 Danh Sách Chuẩn Bị
1. **VPS Linux** (Khuyên dùng **Ubuntu 22.04 LTS** hoặc **Debian 11/12**).
2. **IP của VPS** (Ví dụ: `103.145.xxx.xxx`) và mật khẩu `root` (hoặc SSH Key).
3. Phần mềm SSH terminal (ví dụ: **PuTTY**, **MobaXterm**, hoặc dùng trực tiếp **PowerShell / Terminal** có sẵn trên máy tính).

---

## 🛠️ CÁCH 1: Triển Khai Bằng NGINX (Đơn Giản & Tối Ưu Nhất - Khuyên Dùng)

### Bước 1: Kết nối vào VPS qua SSH
Mở PowerShell/Terminal trên máy tính của bạn và gõ:
```bash
ssh root@<IP_VPS_CUA_BAN>
```
*(Thay `<IP_VPS_CUA_BAN>` bằng địa chỉ IP thật của bạn và nhập mật khẩu VPS khi được hỏi)*.

---

### Bước 2: Cài đặt Node.js & Nginx trên VPS

Chạy các lệnh sau trên VPS để cập nhật hệ thống và cài đặt **Nginx**, **Node.js**:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Nginx
sudo apt install nginx git -y

# Cài đặt Node.js (Phiên bản Node 20 LTS mới nhất)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra cài đặt thành công
node -v
npm -v
nginx -v
```

---

### Bước 3: Đưa Source Code Lên VPS

Bạn có **2 lựa chọn**:

#### Lựa chọn A: Clone code qua Git (Khuyên dùng nếu bạn dùng GitHub/GitLab)
```bash
cd /var/www
git clone <URL_REPOSITORY_GIT_CUA_BAN> my-react-app
cd my-react-app
npm install
npm run build
```
*(Sau lệnh `npm run build`, thư mục kết quả sẽ nằm tại `/var/www/my-react-app/dist`)*.

#### Lựa chọn B: Build ở máy cá nhân rồi Upload file build lên VPS
Nếu bạn build ở máy local (hoặc upload qua SCP/FileZilla/SFTP):
1. Tại máy cá nhân chạy lệnh: `npm run build`
2. Upload toàn bộ các file bên trong thư mục `dist` lên thư mục `/var/www/html/dist` trên VPS.

---

### Bước 4: Cấu hình Nginx Phục Vụ App React (Single Page App - SPA)

1. Tạo file cấu hình Nginx mới cho dự án:
```bash
sudo nano /etc/nginx/sites-available/reactapp
```

2. Dán đoạn cấu hình sau vào (nhớ thay `IP_VPS_HOAC_DOMAIN` thành IP hoặc tên miền của bạn):

```nginx
server {
    listen 80;
    server_name IP_VPS_HOAC_DOMAIN; # Ví dụ: 103.145.12.34 hoặc domain.com

    root /var/www/my-react-app/dist; # Đường dẫn tới thư mục dist đã build
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Bật nén Gzip giúp tải trang nhanh hơn
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

3. Lưu file (bấm `Ctrl + O` rồi `Enter`, sau đó `Ctrl + X` để thoát `nano`).

4. Kích hoạt cấu hình và khởi động lại Nginx:
```bash
# Tạo liên kết đến sites-enabled
sudo ln -s /etc/nginx/sites-available/reactapp /etc/nginx/sites-enabled/

# Xóa cấu hình mặc định (nếu muốn)
sudo rm /etc/nginx/sites-enabled/default

# Kiểm tra cú pháp Nginx
sudo nginx -t

# Khởi động lại Nginx
sudo systemctl restart nginx
```

🎉 **ĐẾN ĐÂY BẠN ĐÃ CÓ THỂ MỞ TRÌNH DUYỆT VÀ TRUY CẬP VÀO `http://<IP_VPS_CUA_BAN>` ĐỂ XEM TRANG WEB!**

---

## 🔒 BƯỚC BỔ SUNG: Cài Đặt SSL Miễn Phí (HTTPS) Với Let's Encrypt

Nếu bạn đã trỏ Tên Miền (Domain) về IP VPS, chạy thêm 2 lệnh sau để có HTTPS miễn phí:

```bash
# Cài đặt Certbot cho Nginx
sudo apt install certbot python3-certbot-nginx -y

# Đăng ký và cài đặt SSL tự động
sudo certbot --nginx -d tendmien.com -d www.tendmien.com
```
*Nhập email của bạn và đồng ý điều khoản. Certbot sẽ tự động cấu hình HTTPS cho Nginx.*

---

## 💡 CÁCH 2: Chạy Bằng Node.js + PM2 (Nó Phù Hợp Cho App Có Backend Node/Express)

Nếu bạn không muốn dùng Nginx static host mà muốn chạy Server Node.js bằng **PM2**:

```bash
# Cài đặt PM2 toàn cục
sudo npm install -g pm2 serve

# Chạy thư mục dist bằng serve trên cổng 3000
pm2 serve /var/www/my-react-app/dist 3000 --name "react-vps-app" --spa

# Lưu cấu hình để PM2 tự khởi động khi VPS khởi động lại
pm2 save
pm2 startup
```

---

## ❓ Xử Lý Lỗi Thường Gặp

1. **Lỗi 404 khi F5 trang con trong React:**
   - **Nguyên nhân:** Thiếu dòng `try_files $uri $uri/ /index.html;` trong cấu hình Nginx.
2. **Lỗi `Permission Denied` (403 Forbidden):**
   - Phân quyền cho thư mục web trên VPS: `sudo chown -R www-data:www-data /var/www/my-react-app/dist` và `sudo chmod -R 755 /var/www/my-react-app/dist`.
3. **Không truy cập được IP trên trình duyệt:**
   - Kiểm tra Firewall trên VPS (UFW): `sudo ufw allow 'Nginx Full'` hoặc kiểm tra Security Group trên nhà cung cấp VPS (Clouding, VietServer, Azure, AWS, DigitalOcean).
