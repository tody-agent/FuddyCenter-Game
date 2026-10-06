# Boxme Mission Control — E-Commerce Fulfillment 3D Simulator & Tycoon Game

Hệ thống mô phỏng 3D Digital Twin, Sandbox ra quyết định What-If & Serious Game Điều hành trung tâm hoàn tất đơn hàng VSIP Bắc Ninh (và chuỗi Hub Đông Nam Á) của Boxme Global.

🌐 **Production URL**: [https://bmwms.pages.dev](https://bmwms.pages.dev)

---

## 📚 KHO TRI THỨC & TÀI LIỆU DỰ ÁN (Project Knowledge Base)

Toàn bộ hệ thống tri thức, đặc tả kỹ thuật và mô hình game được chuẩn hóa trong thư mục [`docs/`](docs/):

### 1. Tài Liệu Cấp Cao (Master Specifications)
* 🌟 **[Master Product Blueprint](docs/FINAL_PRODUCT_MASTER_BLUEPRINT.md)**: Bản thiết kế sản phẩm hoàn thiện cao nhất, tích hợp phản biện từ hội đồng đa Agent (Red Team Systems Balance, 3PL Ops Veteran & Behavioral Psychologist).
* 📋 **[Master Game Design Document (GDD)](docs/GAME_DESIGN_DOCUMENT.md)**: Tài liệu thiết kế game chi tiết (Core loops, 8 phân hệ nghiệp vụ, Dynamic Bottlenecks).
* 📅 **[Master Game Production Plan](docs/MASTER_GAME_PRODUCTION_PLAN.md)**: Kế hoạch sản xuất, sprint bus và lộ trình phát triển.
* 📐 **[OpenSpec 2.0 Technical Specification](docs/superpowers/specs/2026-10-06-boxme-simulator-openspec.md)**: Bản đặc tả kỹ thuật kiến trúc phần mềm Three.js WebGL, Simulation Core, Discrete Engine, Monte Carlo.
* 💼 **[Business Model Canvas & Value Proposition](docs/BUSINESS_MODEL_CANVAS.md)**: Tuyên ngôn giá trị và bài toán kinh tế 4 dòng doanh thu (Internal ROI, B2B Sales, EdTech SaaS, B2C Steam Game).
* 🏆 **[Tycoon Progression & Multi-Currency Engine](docs/TYCOON_PROGRESSION_MULTI_CURRENCY.md)**: Lộ trình 5 cấp độ tiến hóa kho bãi (300m² -> 40.000m²), hệ thống 5 đơn vị kinh tế tương hỗ và vòng lặp Merchant Churn.
* 👥 **[Workforce Management & Labor Dynamics](docs/WORKFORCE_MANAGEMENT_LABOR_DYNAMICS.md)**: Quản trị lao động hai tầng (Core vs Temp Agency), rủi ro bùng ca, buddy system và bài toán lương thị trường.
* 🎨 **[Fulfillment Game Design System (GDS)](docs/FULFILLMENT_GAME_DESIGN_SYSTEM.md)**: Hệ thống design tokens, typography, HUD telemetry, và sound design đa tầng.

### 2. Nghiên Cứu Chuyên Sâu 9 Phân Hệ Vận Hành ([docs/research/](docs/research/))
* `01_inbound_qc_slotting.md`: Tiếp nhận container, QC kiểm date, dỡ hàng & thuật toán xếp kệ ABC.
* `02_picking_wave_routing.md`: Gom đơn wave batching, định tuyến xe nhặt hàng TSP/A*.
* `03_packing_vas_kcs.md`: Đóng gói bàn thao tác, bọc bóng khí, VAS quà tặng & cân KCS kiểm trọng lượng.
* `04_sortation_outbound_sla.md`: Phân loại bưu cục máng trượt, chạy đua SLA Shopee FHR & TikTok FDR.
* `05_layout_racking_robotics.md`: Bố trí layout kệ Mezzanine, High Bay, xe nâng AGV & robot tự hành AMR.
* `06_workforce_fatigue_skills.md`: Quản trị thể lực, mệt mỏi ca kíp, kỹ năng thợ & ca làm thêm OT.
* `07_tycoon_economy_crisis_events.md`: Kinh tế kho bãi, hợp đồng thương gia, khấu hao máy móc & sự cố Boss Waves.
* `08_3d_digital_twin_hud_audio.md`: Đồ họa 3D Three.js PBR, N8AO, shader cảnh báo & Web Audio API.
* `09_gamedev_engine_skills_security_architecture.md`: Kiến trúc engine gamedev, bảo mật agentic skills & sandbox.

---

## 🔒 Kiến trúc Bảo mật & Mã hóa (Security Architecture)

Hệ thống áp dụng cơ chế xác thực đa tầng bảo vệ thông tin nội bộ:

1. **Zero Plaintext Password**: Mật khẩu hoàn toàn **không lưu dưới dạng văn bản thô (plaintext)**.
2. **Kỹ thuật kéo giãn khóa (Key Stretching - PBKDF2-HMAC-SHA256)**: Chuẩn Web Cryptography API (`crypto.subtle`) với thuật toán PBKDF2 (100.000 vòng lặp).
3. **Cơ chế Challenge-Response (Zero-Knowledge Proof)**: Nonce dùng một lần có chữ ký số HMAC, thời hạn hiệu lực 90 giây.
4. **Cloudflare Edge Middleware & JWT Session**: Session cookie mã hóa HttpOnly, Secure được kiểm tra trực tiếp tại mạng biên Cloudflare.
5. **Chống Timing & Brute-force**: Hàm so sánh thời gian bất biến `timingSafeEqual` và cơ chế trễ nhân tạo.

---

## 🚀 Cấu trúc Thư mục Gọn gàng (Clean Project Structure)

```
bmwms/
├── assets/
│   └── images/            # Concept art, nhân vật, trang thiết bị 3D
├── docs/                  # Kho tri thức & đặc tả kỹ thuật toàn diện
│   ├── research/          # 9 phân hệ nghiên cứu nghiệp vụ kho bãi chuyên sâu
│   └── superpowers/specs/ # Bản đặc tả kỹ thuật OpenSpec 2.0
├── functions/             # Cloudflare Pages Functions (Edge Middleware & Auth API)
│   ├── _middleware.js     # Chặn truy cập trái phép tại Edge
│   └── api/
│       ├── challenge.js   # Cấp phát Nonce 1 lần
│       ├── login.js       # Xác thực Proof & cấp phát JWT
│       └── logout.js      # Xóa phiên đăng nhập
├── game-design-system.html# Showroom tương tác Game Design System & HUD Components
├── index.html             # Boxme Mission Control 3D Simulator (Active Production)
├── login.html             # Giao diện đăng nhập chuẩn Dark Theme Boxme
├── scripts/
│   └── audit-gamedev-skills.py # Scanner an ninh chuyên dụng
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
