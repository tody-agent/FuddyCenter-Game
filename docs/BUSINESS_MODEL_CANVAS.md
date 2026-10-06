# BUSINESS MODEL CANVAS & VALUE PROPOSITION CANVAS
## Fulldy Center & Operations Simulator 2.0
**Mô phỏng Vận hành 3D, Bản sao số (Digital Twin) & Serious Game Logistics**

* **Mã tài liệu:** BMC-VPC-SIM-2026-10-06
* **Phiên bản:** 1.0.0
* **Ngày lập:** 06/10/2026
* **Đơn vị phát triển:** Fulldy Games Architecture Group

---

## 1. VALUE PROPOSITION CANVAS (VPC) - KHUNG TUYÊN NGÔN GIÁ TRỊ

Dự án phục vụ **3 phân khúc khách hàng mục tiêu (Multi-sided Stakeholders)** với các bài toán giá trị riêng biệt:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VALUE PROPOSITION CANVAS                              │
├───────────────────────────────────────┬─────────────────────────────────────────┤
│         VALUE MAP (SẢN PHẨM)          │      CUSTOMER PROFILE (KHÁCH HÀNG)      │
├───────────────────────────────────────┼─────────────────────────────────────────┤
│ Products & Services:                  │ Customer Jobs (Nhiệm vụ cần làm):       │
│ - 3D Digital Twin Simulator           │ - Đảm bảo SLA 99% cho Shopee/TikTok     │
│ - What-If Decision Sandbox            │ - Đào tạo quản lý kho mới nhanh chóng   │
│ - Monte Carlo Risk Engine             │ - Chốt hợp đồng với nhãn hàng lớn       │
│                                       │                                         │
│ Pain Relievers (Thuốc giảm đau):      │ Pains (Nỗi đau):                        │
│ - Thử nghiệm không sợ vỡ đơn thật     │ - Phạt vi phạm SLA hàng trăm triệu/tháng│
│ - Giảm 75% thời gian onboarding quản lý│ - Quá tải, nghẽn kho mùa Mega Sale      │
│ - Dự báo chính xác chi phí lương OT   │ - Khách hàng không tin năng lực kho     │
│                                       │                                         │
│ Gain Creators (Cơ chế tạo giá trị):   │ Gains (Lợi ích kỳ vọng):                │
│ - Rèn luyện trực giác điều hành       │ - Tiết kiệm 15-25% chi phí OPEX         │
│ - Công cụ Sales Showcasing đỉnh cao   │ - Tăng tỷ lệ chốt Deal B2B Enterprise   │
│ - Tối ưu hóa phân bổ nguồn lực        │ - Định vị thương hiệu 3PL công nghệ cao │
└───────────────────────────────────────┴─────────────────────────────────────────┘
```

---

### Phân khúc 1: Nội bộ Vận hành fulldy (COO, Warehouse Directors, Shift Leaders)

#### A. Customer Profile (Chân dung khách hàng nội bộ):
* **Customer Jobs (Việc cần làm):**
  - Vận hành trơn tru kho VSIP Bắc Ninh (và chuỗi kho Đông Nam Á) trong các đợt Mega Sale (10.10, 11.11, 12.12).
  - Cam kết tỷ lệ hoàn tất Shopee FHR > 98.5%, TikTok FDR/LDR trong chu kỳ 6 giờ.
  - Lên phương án nhân sự ca kíp, dự trù chi phí làm thêm giờ (OT) và xe tải đón hàng.
  - Đào tạo đội ngũ Shift Leader, Supervisor tập sự kế cận.
* **Pains (Nỗi đau nhức nhối):**
  - **Nỗi sợ vỡ trận ngày Sale:** Đơn hàng tăng đột biến gấp 5 lần khiến bãi đệm IS Buffer nghẽn cứng, hàng không kịp đóng gói, bị sàn TMĐT phạt tiền và hạ xếp hạng Shop của khách hàng.
  - **Chi phí đào tạo đắt đỏ & rủi ro cao:** Không thể để nhân viên tập sự "thử nghiệm sai lầm" trên hàng thật của khách hàng (làm vỡ hàng, dán nhầm tem, giao trễ).
  - **Mù mờ khi ra quyết định (Decision Blindspot):** Không biết điều 15 thợ từ Pack sang Pick có làm nghẽn bàn đóng gói 30 phút sau hay không.
* **Gains (Mong muốn đạt được):**
  - Một môi trường sandbox ảo an toàn để kiểm chứng các kịch bản điều phối.
  - Khả năng dự báo trước điểm nghẽn 30–60 phút với xác suất tin cậy P90 từ Monte Carlo.
  - Tối ưu hóa chi phí OPEX (không thuê thừa xe ngoài, không gọi thừa nhân công OT).

#### B. Value Map (Giá trị Fulldy Center Simulator mang lại):
* **Pain Relievers (Giải tỏa nỗi đau):**
  - **Risk-free Training Sandbox:** Nhân sự được "cháy kho trong game" 50 lần trước khi bước vào ca trực thật, tích lũy trực giác xử lý khủng hoảng (Crisis Intuition).
  - **What-If Time-Travel DAG:** Cho phép tua lại thời gian, thử nghiệm rẽ nhánh: *"Phương án A (gọi xe) vs Phương án B (ưu tiên sàn TikTok)"* để đo lường con số thiệt hại/chi phí cụ thể trước khi bấm lệnh thực tế.
* **Gain Creators (Kiến tạo giá trị vượt trội):**
  - Cắt giảm 70% thời gian đào tạo một Quản lý kho (từ 6 tháng xuống còn 3 tuần).
  - Tiết kiệm 15–20% chi phí phụ cấp/OT nhờ phân bổ lao động chính xác theo đường cong Poisson của đơn hàng.

---

### Phân khúc 2: Khách hàng B2B Doanh nghiệp (Enterprise Brands & E-commerce Merchants)

#### A. Customer Profile:
* **Customer Jobs:** Tìm kiếm đối tác 3PL/Fulfillment uy tín để giao phó toàn bộ kho vận trong các chiến dịch bán hàng hàng triệu USD.
* **Pains:**
  - Nỗi sợ đối tác logistics "nói hay làm dở", hứa hẹn năng lực ảo nhưng đến ngày Sale thì đơn bị ngâm nhiều ngày.
  - Thiếu tính minh bạch: Không biết kho đang xử lý đến đâu, hàng có bị nghẽn không.
* **Gains:** Yên tâm tuyệt đối về SLA; có báo cáo phân tích rủi ro trực quan trước chiến dịch lớn.

#### B. Value Map:
* **Pain Relievers & Gain Creators:**
  - **Vũ khí Sales & Showcasing Đỉnh cao:** Thay vì xem slide PowerPoint nhàm chán, đội ngũ Sales của fulldy mở trực tiếp 3D Mission Control Digital Twin. Khách hàng nhìn thấy đơn hàng của họ di chuyển qua từng zone, thuật toán cân tải thời gian thực.
  - **Đảm bảo năng lực dựa trên xác suất:** fulldy chạy mô phỏng Monte Carlo 1.000 lần trước mặt khách hàng: *"Với 50.000 đơn của anh/chị, xác suất bàn giao đúng 17:00 là 98.7% với phương án nhân sự này"*. Tạo dựng niềm tin áp đảo so với các đối thủ 3PL truyền thống.

---

### Phân khúc 3: Thị trường Đào tạo Chuỗi Cung ứng & Doanh nghiệp Logistics Ngoài (EdTech & Commercial SaaS)

#### A. Customer Profile:
* Các trường Đại học có chuyên ngành Logistics & SCM (RMIT, NEU, FTU, UTH), các viện đào tạo (VILAS, FIATA), và các công ty logistics vừa và nhỏ (SME 3PLs).
* **Pains:** Sinh viên và học viên chỉ được học lý thuyết chuỗi cung ứng trên giấy; thiếu công cụ mô phỏng trực quan tương tác thực tế; chi phí xây dựng phòng lab kho bãi thật quá đắt đỏ ($500k - $2M).
* **Gains:** Nền tảng thực hành mô phỏng số hóa chi phí thấp, tính trực quan 3D sống động, chấm điểm tự động.

---

## 2. BUSINESS MODEL CANVAS (BMC) - 9 KHỐI TOÀN DIỆN

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             BUSINESS MODEL CANVAS                                                     │
├───────────────────┬───────────────────┬───────────────────────────────┬───────────────────┬───────────────────────────┤
│ KEY PARTNERS      │ KEY ACTIVITIES    │ VALUE PROPOSITIONS            │ CUSTOMER          │ CUSTOMER                  │
│ (Đối tác chính)   │ (Hoạt động chính) │ (Tuyên ngôn giá trị)          │ RELATIONSHIPS     │ SEGMENTS                  │
│                   │                   │                               │ (Quan hệ KH)      │ (Phân khúc khách hàng)    │
│ - Các sàn TMĐT    │ - R&D Simulation  │ 1. Cho Nội bộ fulldy:          │ - Internal Co-    │ 1. Ban Điều hành &        │
│   (Shopee, TikTok,│   Engine & PRNG   │    "Không sợ vỡ đơn thật,     │   design & Ops    │    Quản lý kho fulldy      │
│   Lazada)         │ - Dựng hình 3D    │    rèn luyện trực giác điều   │   Feedback        │    (Bắc Ninh, Long An,    │
│ - Hãng vận chuyển │   Three.js & WebGL│    hành trong 3 tuần thay vì  │ - Enterprise High-│    Bangkok)               │
│   (SPX, J&T, GHN) │ - Tích hợp WMS/   │    6 tháng; giảm 15% OPEX".   │   Touch Sales     │ 2. Khách hàng B2B         │
│ - Trường ĐH &     │   OMS fulldy API   │ 2. Cho Khách B2B:             │ - Self-service    │    Enterprise (Nhãn hàng  │
│   Học viện SCM    │ - Thiết kế game   │    "Minh bạch tuyệt đối,      │   EdTech Portal   │    lớn, Top Brand Mall)   │
│ - Cloudflare Pages│   mechanics & kịch│    chứng minh năng lực SLA    │ - Community       │ 3. Trường ĐH đào tạo      │
│   & WebGL infra   │   bản khủng hoảng │    bằng dữ liệu mô phỏng".    │   Leaderboard     │    Logistics & Viện SCM   │
│                   ├───────────────────┤ 3. Cho Thị trường Đào tạo:    ├───────────────────┤ 4. Game thủ yêu thích     │
│                   │ KEY RESOURCES     │    "Serious Game Logistics    │ CHANNELS          │    thể loại Tycoon        │
│                   │ (Nguồn lực chính) │    chuẩn mực Đông Nam Á".     │ (Kênh phân phối)  │    (B2C tương lai)        │
│                   │ - Dữ liệu vận hành│                               │ - Fulldy Center Portal  │                           │
│                   │   thực tế 10 năm  │                               │ - B2B Pitch Deck  │                           │
│                   │ - Engine mô phỏng │                               │ - Web bmwms.pages │                           │
│                   │ - Đội ngũ Tech &  │                               │ - Hội thảo SCM    │                           │
│                   │   Chuyên gia Ops  │                               │ - Steam / App Store│                          │
├───────────────────┴───────────────────┴───────────────────────────────┴───────────────────┴───────────────────────────┤
│ COST STRUCTURE (Cơ cấu chi phí)                               │ REVENUE STREAMS (Dòng doanh thu & Giá trị thu về)     │
│ - Chi phí R&D phát triển phần mềm (Three.js, Simulation Core) │ 1. Internal Value Capture (Tiết kiệm chi phí nội bộ): │
│ - Chi phí hạ tầng Cloud (Cloudflare Pages, Edge Computing)    │    - Cắt giảm 15-20% chi phí phạt SLA & Overtime (OT).│
│ - Chi phí biên soạn kịch bản đào tạo & Game design            │ 2. B2B Deal Conversion Acceleration:                  │
│ - Chi phí bảo trì và tích hợp API WMS/OMS                     │    - Tăng tỷ lệ chốt hợp đồng lớn thêm 25-35%.        │
│                                                               │ 3. EdTech & SaaS Licensing (Bán ra ngoài):            │
│                                                               │    - Gói bản quyền đào tạo cho trường ĐH ($5k-$20k/năm)│
│                                                               │ 4. B2C Game Publishing (Bản thương mại Steam):        │
│                                                               │    - Doanh thu bán game $14.99 - $19.99/bản.          │
└───────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. CHI TIẾT 9 KHỐI CỦA BUSINESS MODEL CANVAS

### 3.1 Phân khúc Khách hàng (Customer Segments)
1. **Internal Operations (Nội bộ fulldy):**
   - Shift Leaders, Hub Managers, Operations Directors tại 6 trung tâm fulfillment (Việt Nam, Thái Lan, Indonesia).
   - Đội ngũ Nhân sự & Đào tạo (HR & Operations Academy).
2. **B2B Enterprise Clients (Khách hàng Doanh nghiệp):**
   - Các thương hiệu lớn trên Shopee Mall, LazMall, TikTok Shop (ngành Mỹ phẩm, FMCG, Thời trang, Điện tử).
   - Khách hàng bán hàng xuyên biên giới (Cross-border Sellers từ Trung Quốc, Hàn Quốc).
3. **Academic & Commercial Training (Khách hàng Đào tạo Bên ngoài):**
   - Các khoa Logistics & Supply Chain Management của các trường Đại học tại Việt Nam và Đông Nam Á.
   - Các học viện đào tạo nghề Logistics (VILAS, FIATA).
4. **B2C Tycoon Gamers (Thị trường Đại chúng - Tùy chọn):**
   - Nhóm người chơi đam mê thể loại quản lý mô phỏng như *Factorio, Big Ambitions, Mini Motorways*.

### 3.2 Tuyên ngôn Giá trị (Value Propositions)
* **Đối với Vận hành Nội bộ:**
  - *"Zero-Risk Operational Training"*: Biến việc đào tạo quản lý kho từ bị động, rủi ro thành một quá trình rèn luyện trực giác có chủ đích thông qua Serious Game.
  - *"Predictive Decision Sandbox"*: Cho phép thử nghiệm các quyết định điều hành (What-If) và nhận phân tích rủi ro Monte Carlo trước khi áp dụng vào thực tế, giảm thiểu 15–20% chi phí phạt SLA và chi phí OT thừa.
* **Đối với Khách hàng B2B:**
  - *"Radical Operational Transparency"*: Cung cấp một bản sao số (Digital Twin) trực quan, chứng minh năng lực thực tế của fulldy bằng dữ liệu 3D thời gian thực thay vì lời hứa suông.
* **Đối với Thị trường Đào tạo:**
  - *"State-of-the-Art Logistics Sandbox"*: Cung cấp nền tảng mô phỏng kho bãi chuẩn mực quốc tế đầu tiên tại Đông Nam Á với chi phí chỉ bằng 1/50 so với việc đầu tư kho thực nghiệm vật lý.

### 3.3 Kênh Phân Phối (Channels)
* **Kênh nội bộ:** Hệ thống Fulldy Center Portal & Cổng đào tạo Fulldy Academy (`bmwms.pages.dev`).
* **Kênh B2B Sales:** Tích hợp trực tiếp vào quy trình thuyết trình bán hàng (Sales Demo / Client Experience Center) tại trụ sở fulldy.
* **Kênh Học thuật / EdTech:** Tiếp cận qua các hội thảo khoa học chuỗi cung ứng, hợp tác doanh nghiệp - nhà trường (University Partnership Programs).
* **Kênh Game thương mại:** Phát hành bản standalone qua Steam, Epic Games Store, hoặc WebApp.

### 3.4 Quan Hệ Khách Hàng (Customer Relationships)
* **Co-Creation & Continuous Feedback:** Đội ngũ Quản lý kho thực tế đóng vai trò người thử nghiệm (Alpha Testers), liên tục đóng góp kịch bản khủng hoảng mới ngoài đời thực vào game.
* **High-Touch Enterprise Demonstrations:** Trải nghiệm demo 1-on-1 có người hướng dẫn dành cho các khách hàng VIP.
* **Automated Self-Service:** Hệ thống tự động chấm điểm Rank S/A/B/C/F và tạo báo cáo AAR (After Action Review) sau mỗi phiên chơi.

### 3.5 Dòng Doanh Thu & Giá Trị Thu Về (Revenue Streams & ROI)
Dự án tạo ra giá trị qua 4 dòng lợi ích:

1. **Dòng Giá Trị Nội Bộ (Internal Value Capture - ROI Lớn Nhất):**
   - **Cắt giảm tiền phạt vi phạm SLA:** Giảm 30–50% số đơn trễ hạn trong các đợt Siêu Sale nhờ khả năng dự báo trước điểm nghẽn. (Ước tính tiết kiệm: 200.000.000 – 500.000.000 VNĐ / chiến dịch).
   - **Tối ưu hóa chi phí làm thêm giờ (OPEX Optimization):** Giảm 15% giờ OT không cần thiết nhờ điều chuyển nhân sự chuẩn xác.
   - **Rút ngắn thời gian Onboarding:** Giảm 75% chi phí đào tạo một Quản lý kho mới.
2. **Đòn Bẩy Doanh Thu B2B (Sales Enablement Multiplier):**
   - Đóng vai trò là "Killer Feature" giúp tăng tỷ lệ chốt hợp đồng (Win Rate) thêm 25–35% khi đấu thầu các hợp đồng fulfillment trị giá hàng triệu USD.
3. **Bản Quyền Đào Tạo EdTech (Software-as-a-Service Licensing):**
   - Bán gói phần mềm giảng dạy cho các trường Đại học: $3.000 – $10.000 / trường / năm.
4. **Doanh Thu Thương Mại Hóa Game (B2C Game Sales - Tương lai):**
   - Bản game "Warehouse Master Tycoon" phát hành trên Steam: $14.99 – $19.99 / lượt tải.

### 3.6 Nguồn Lực Chính (Key Resources)
* **Dữ liệu Vận hành 10 Năm:** Toàn bộ thông số thực tế của hàng triệu đơn hàng Shopee, TikTok Shop, WPH của từng loại SKU, độ trễ xe tải theo từng tuyến đường.
* **Simulation Core Engine:** Bộ thuật toán Discrete Timestep, Mulberry32 PRNG tất định, và mô hình hàng đợi M/M/c.
* **Đội ngũ Nhân sự Lai (Hybrid Team):** Kỹ sư lập trình WebGL/Three.js + Chuyên gia Vận hành Kho thực chiến + Nhà thiết kế Game.
* **Bản quyền Trí tuệ (IP) & Thương hiệu:** Thương hiệu Fulldy Games Fulfillment.

### 3.7 Hoạt Động Chính (Key Activities)
* **R&D Thuật toán Mô phỏng:** Nâng cấp liên tục độ chính xác của lõi tính toán logistics so với dữ liệu thực tế ngoài kho.
* **Thiết kế Game & Kịch bản (Crisis Engineering):** Xây dựng các màn chơi thử thách (Boss Waves) phản ánh các sự cố mới của thị trường E-commerce Đông Nam Á.
* **Phát triển Đồ họa & Web Audio:** Tối ưu hóa hiệu năng render 120 FPS trên trình duyệt và thiết kế tầng âm thanh kích thích Dopamine.
* **Tích hợp API Hai chiều:** Kết nối WMS/OMS fulldy để có thể nạp dữ liệu ca thật vào simulator và ngược lại.

### 3.8 Đối Tác Chính (Key Partners)
* **Các Sàn Thương mại Điện tử (Shopee, TikTok Shop, Lazada):** Cung cấp tiêu chuẩn SLA, quy định tính điểm phạt, và dữ liệu xu hướng Mega Sale.
* **Các Đơn vị Vận chuyển (SPX, GHN, J&T Express, Ninja Van):** Cung cấp dữ liệu thời gian xe đến bến, độ trễ giao thông.
* **Cloudflare:** Hạ tầng mạng biên Edge Worker và Pages phục vụ trải nghiệm WebGL độ trễ thấp toàn cầu.
* **Các Viện nghiên cứu & Hiệp hội Logistics (VLA, VILAS):** Đối tác kiểm chuẩn nội dung đào tạo chuyên môn.

### 3.9 Cơ Cấu Chi Phí (Cost Structure)
* **Chi phí Phát triển Phần mềm (R&D):** Lương đội ngũ Frontend/WebGL/Simulation engineers.
* **Chi phí Hạ tầng & Hosting:** Cloudflare Pages, Edge Functions, lưu trữ tài nguyên 3D (rất thấp nhờ kiến trúc Client-side WebGL & Procedural Geometry).
* **Chi phí Thiết kế Âm thanh & Nghệ thuật 3D:** Sản xuất SFX, shader, tối ưu 3D assets.
* **Chi phí Vận hành & Cập nhật:** Bảo trì thuật toán, bổ sung kịch bản định kỳ theo các đợt Sale mới.

---

## 4. CHIẾN LƯỢC TRIỂN KHAI GIÁ TRỊ (Strategic Roadmap)

| Giai đoạn | Mục tiêu Trọng tâm | Thước đo Thành công (KPI) |
|---|---|---|
| **Phase 1: Internal Value (Hiện tại)** | Hoàn thiện công cụ phục vụ đào tạo Shift Leader và mô phỏng đợt Mega Sale nội bộ fulldy VSIP Bắc Ninh. | - Giảm 50% lỗi sai của Shift Leader mới.<br>- Không có sự cố vỡ trận SLA trong đợt Mega Sale tiếp theo. |
| **Phase 2: Sales Enablement (Quý tới)** | Đưa simulator vào quy trình Pitching khách hàng B2B Enterprise & Showroom trải nghiệm. | - Tăng 25% tỷ lệ chốt hợp đồng lớn.<br>- Rút ngắn chu kỳ đàm phán hợp đồng từ 3 tháng xuống 1 tháng. |
| **Phase 3: EdTech & Industry Hub** | Đóng gói phiên bản giáo dục (Educational Edition) cho các trường Đại học Logistics. | - Ký hợp tác với 3–5 trường đại học lớn.<br>- Tạo dựng vị thế fulldy là Tech Leader trong ngành 3PL. |
| **Phase 4: Commercial Tycoon Game** | Tách lớp dữ liệu bảo mật, phát hành bản thương mại giải trí ra thị trường toàn cầu. | - Tạo dòng doanh thu độc lập và marketing lan tỏa thương hiệu fulldy ra quốc tế. |

---

© 2026 Fulldy Games Platform. All rights reserved.
Tài liệu định hướng kinh doanh Fulldy Center.
