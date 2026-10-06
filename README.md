# Boxme Mission Control — VSIP Bắc Ninh Fulfillment Center

Hệ thống mô phỏng 3D Digital Twin & Điều hành vận hành trung tâm hoàn tất đơn hàng (Fulfillment Center) VSIP Bắc Ninh của Boxme Global.

🌐 **Production URL**: [https://bmwms.pages.dev](https://bmwms.pages.dev)

---

## 🔒 Kiến trúc Bảo mật & Mã hóa (Security Architecture)

Hệ thống áp dụng cơ chế xác thực đa tầng bảo vệ thông tin nội bộ:

1. **Zero Plaintext Password**:
   - Mật khẩu hoàn toàn **không lưu dưới dạng văn bản thô (plaintext)** trong bất kỳ file mã nguồn hay kho lưu trữ nào.
   - Mã nguồn trên GitHub và client không chứa chuỗi mật khẩu.

2. **Kỹ thuật kéo giãn khóa (Key Stretching - PBKDF2-HMAC-SHA256)**:
   - Sử dụng chuẩn Web Cryptography API (`crypto.subtle`) với thuật toán **PBKDF2** (100.000 vòng lặp) kết hợp chuỗi Salt định danh kho riêng biệt.

3. **Cơ chế Challenge-Response (Zero-Knowledge Proof & Chống Replay Attack)**:
   - Mật khẩu không bao giờ được gửi qua đường truyền mạng.
   - Mỗi lần đăng nhập, client yêu cầu một **One-time Nonce** có chữ ký số HMAC từ server (thời gian hiệu lực 90 giây).
   - Client sinh bằng chứng xác thực (`Proof = HMAC-SHA256(ClientKey, Nonce)`) và gửi về server.

4. **Cloudflare Edge Middleware & JWT Cryptographic Session**:
   - Khi đăng nhập thành công, Cloudflare Edge cấp session cookie (`HttpOnly; Secure; SameSite=Lax`) được ký bằng chữ ký số HMAC-SHA256.
   - Middleware chạy tại Cloudflare Edge chặn trực tiếp tất cả các truy cập trái phép trước khi nội dung được tải về máy khách.

5. **Phòng chống tấn công Timing & Brute-force**:
   - Hàm so sánh thời gian bất biến (`timingSafeEqual`) chống tấn công dò tìm qua độ trễ vi giây (Timing Attack).
   - Cơ chế trễ nhân tạo trên các lần thử thất bại ngăn chặn các bot crack tự động.

---

## 🚀 Cấu trúc dự án

```
bmwms/
├── functions/
│   ├── _middleware.js     # Cloudflare Edge Middleware kiểm tra session JWT
│   └── api/
│       ├── challenge.js   # Endpoint sinh Nonce mã hóa 1 lần
│       ├── login.js       # Xác thực Proof & cấp phát session token JWT
│       └── logout.js      # Hủy phiên đăng nhập
├── index.html             # Boxme Mission Control 3D Simulator
├── login.html             # Giao diện đăng nhập chuẩn Dark Theme Boxme
├── .project-identity.json # Cấu hình danh tính dự án Git & Cloudflare
└── README.md
```

---

## 🛠️ Triển khai (Deployment)

Dự án được triển khai tự động qua Cloudflare Pages:

```bash
# Triển khai trực tiếp lên Cloudflare Pages
npx wrangler pages deploy . --project-name bmwms --branch main
```

© 2026 Boxme Global Fulfillment Platform. All rights reserved.
