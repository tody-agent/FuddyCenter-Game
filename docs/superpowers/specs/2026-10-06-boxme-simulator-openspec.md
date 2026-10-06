# OpenSpec: Boxme Mission Control & Operations Simulator 2.0
**Hệ thống Mô phỏng Vận hành Kho bãi 3D, Bản sao số (Digital Twin) & Serious Game Điều hành Dựa trên Tâm lý học Hành vi**

* **Mã đặc tả:** OPENSPEC-SIM-2026-10-06
* **Trạng thái:** FINAL / COMPREHENSIVE PRODUCTION SPECIFICATION (Đã tích hợp đầy đủ nghiên cứu Game Mechanics & Tâm lý học hành vi)
* **Phiên bản:** 2.0.0
* **Ngày cập nhật:** 06/10/2026
* **Tác giả:** Antigravity Architecture Group & Boxme Global Logistics Engineering
* **Tài liệu nghiên cứu nền tảng:** `docs/research/2026-10-06-game-simulation-behavioral-psychology.md`

---

## 1. TỔNG QUAN & TẦM NHÌN DỰ ÁN (Project Vision & Core Philosophy)

### 1.1 Bối cảnh & Fantasy của Game
Phiên bản tiền nhiệm là một file HTML đơn khối (`boxme-mission-control.html`, dung lượng ~1.07MB) tích hợp Three.js, React và dữ liệu tĩnh của kho Boxme VSIP Bắc Ninh trong đợt Mega Sale 10.10.

Phiên bản 2.0 chuyển hóa nền tảng này thành một **Hệ thống Mô phỏng Vận hành Toàn diện (Operations Simulation & Management Game / Digital Twin)** với triết lý:
> **Core Fantasy:** *"Người chơi không chỉ là người ngắm nhìn mô hình 3D tĩnh, mà là Tổng chỉ huy điều hành một thực thể sống — một trung tâm hoàn tất đơn hàng khổng lồ liên tục lệch tải, liên tục phát sinh điểm nghẽn, với áp lực deadline SLA của các sàn TMĐT đè nặng từng giây — buộc người chơi phải đưa ra những quyết định đánh đổi chiến thuật sáng suốt nhất để cứu vãn dòng chảy và bảo vệ chi phí vận hành."*

### 1.2 "Constraint-Surfing Simulator" (Lướt trên điểm nghẽn)
Khác với các game xây dựng công xưởng thông thường (Factorio, SimCity), bài toán vận hành fulfillment E-commerce là một **dây chuyền vừa song song, vừa hội tụ, vừa đồng bộ**:
$$\text{Inbound} \longrightarrow \text{Pick Zones (A–E)} \xrightarrow{\text{IS Buffer (Gom đơn multi-item)}} \text{Pack Banks (P01–P50)} \longrightarrow \text{Handover (A–D)} \longrightarrow \text{Docks (D1–D6)}$$

Điểm nghẽn không bao giờ triệt tiêu hoàn toàn. Game được thiết kế như một **cỗ máy lướt trên điểm nghẽn (Constraint-Surfing Engine)** dựa trên Lý thuyết Điểm nghẽn (Goldratt's Theory of Constraints): Khi người chơi can thiệp giải tỏa khâu này, áp lực tích lũy sẽ dịch chuyển sang khâu kế tiếp, tạo ra thử thách leo thang liên tục (Escalating Tension).

---

## 2. KIẾN TRÚC PHẦN MỀM TỔNG THỂ (System Architecture)

Hệ thống tuân thủ nguyên tắc **Tách rời triệt để (Strict Decoupling)** giữa Simulation Engine, Render Loop, Logic Game, và Giao diện UI:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REACT 19 UI LAYER                                    │
│   Mission Header Bar ── 14 KPI Ribbon ── Risk Inbox ── Tactical Inspector              │
│   Time-Travel Timeline (DAG) ── Shift Debrief & Grade Modal ── i18n (VI/EN/TH/ZH)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Zustand Stores / Event Bus
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                       DECISION, GAME LOOP & BEHAVIORAL ENGINE                          │
│   Command Pattern (Action Cards) ── State Snapshots (DAG Tree) ── Time-Travel Replay  │
│   Dynamic Pacing Director (Neuro-Pacing) ── Scorecard Evaluator (COS Score)            │
│   Audio-Visual Feedback Controller (SLA Countdown Heartbeat, Scanning Dings)           │
└───────────────────────────┬────────────────────────────────┬───────────────────────────┘
                            │                                │
┌───────────────────────────▼──────────────┐   ┌─────────────▼───────────────────────────┐
│         SIMULATION CORE (LOGIC)          │   │        THREE.JS RENDER PIPELINE         │
│   Discrete Timestep Clock (10-20Hz)      │   │   RAF Loop (60-120 FPS)                 │
│   Deterministic PRNG (Mulberry32)        │   │   State Interpolation (LERP)            │
│   Queue Network & Dynamic Bottlenecks    │   │   InstancedMesh (Boxes, Pallets, Crowd) │
│   SLA Predictor (FHR, FDR, LDR)          │   │   N8AO Ambient Occlusion + ACES Filmic  │
│   Web Worker: Parallel Monte Carlo       │   │   Selective Bloom (Pulsing Risk Alerts) │
│   Worker Fatigue & Error Decay Model     │   │   Dynamic Camera Director (GSAP Tweens) │
└──────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

---

## 3. LÕI TÍNH TOÁN LOGISTICS & DỮ LIỆU ĐẦU VÀO (Simulation Core)

### 3.1 Luồng Hàng Hóa Vật Lý Đa Chặng
1. **Inbound & Receiving:** Tiếp nhận xe container hàng nhập, dỡ pallet vào khu vực đệm lưu trữ tạm.
2. **Pick Zones (A–E):** 5 khu vực nhặt hàng phân tầng theo danh mục sản phẩm (Mỹ phẩm, Thời trang, Điện tử, Tiêu dùng nhanh, Hàng cồng kềnh).
3. **IS Buffer (Item Sorting & Consolidation Buffer):** Bãi đệm gom đơn đa món (multi-item). Đây là điểm nghẽn trí mạng: Đơn chỉ được chuyển sang đóng gói khi **đủ 100% SKU thành phần**.
4. **Pack Banks (P01–P50):** 50 bàn đóng gói tiêu chuẩn chia làm 5 cụm (Bank 1–5), cộng thêm 3 bàn khẩn cấp dự phòng (Emergency Benches E1–E3).
5. **Handover Sorting:** Phân loại theo hãng vận chuyển (SPX, GHN, J&T, Ninja Van, Viettel Post).
6. **Dock Bays (D1–D6):** 6 cửa xuất xe tải trọng lớn với cửa cuốn cơ khí và sàn nâng dock leveler tự động.

### 3.2 Hệ Số Phức Tạp Đơn Hàng ($C_{\text{type}}$) & Năng Suất Thực Tế
Năng suất chuẩn của nhân sự ($WPH_{\text{chuẩn}}$) bị suy giảm theo độ phức tạp của giỏ hàng và chỉ số mệt mỏi:

$$WPH_{\text{thực tế}} = \frac{WPH_{\text{chuẩn}}}{C_{\text{pick/pack}}} \times f_{\text{fatigue}}(t)$$

| Loại đơn hàng | Tỷ trọng mặc định | $C_{\text{pick}}$ | $C_{\text{pack}}$ | Tác động vận hành |
|---|---|---|---|---|
| **Single Item** | 42% | 1.0 | 1.0 | Tốc độ nhanh nhất, chạy thẳng từ Pick sang Pack không qua IS Buffer |
| **Mix Multi-Item** | 22% | 1.7 | 1.6 | Bắt buộc gom tại IS Buffer; nguy cơ kẹt nếu thiếu 1 SKU |
| **Combo Khuyến mại** | 14% | 1.5 | 1.4 | Gói quà tặng kèm, cần kiểm tra VAS (Value Added Service) |
| **Heavy / Cồng kềnh** | 8% | 2.2 | 2.4 | Cần xe nâng hoặc 2 người nâng, chiếm diện tích bãi đệm gấp 3 lần |
| **Pre-packed** | 6% | 0.6 | 0.5 | Hàng đóng sẵn bao bì từ NSX, chỉ dán tem vận chuyển |
| **Liquid / Fragile** | 5% | 1.9 | 2.2 | Cần bọc xốp bóng khí (bubble wrap), nguy cơ bục vỡ |
| **B2B Bulk** | 3% | 2.8 | 3.0 | Đơn sỉ nguyên pallet xuất thẳng ra dock |

### 3.3 Hàm Mệt Mỏi & Tỷ Lệ Lỗi Nhân Sự (Worker Fatigue & Error Model)
Năng suất công nhân suy giảm theo thời gian làm việc trong ca ($t$ tính bằng giờ):

$$f_{\text{fatigue}}(t) = 1.0 - 0.035 \times \max(0, t - 4.0) - 0.08 \times \mathbb{I}_{\text{Overtime}}$$

Tỷ lệ sai sót khi đóng gói (dán nhầm nhãn, thiếu phụ kiện) tăng theo hàm số mũ khi thợ kiệt sức:

$$E_{\text{rate}}(t) = E_0 \times \left(1 + 0.4 \times (1.0 - f_{\text{fatigue}}(t))^2 \times \mathbb{I}_{\text{HighStress}}\right)$$

### 3.4 Giám Sát SLA Thời Gian Thực
- **Shopee Fast Handover Rate (FHR):** Đơn đặt trước 12:00 phải bàn giao cho tài xế trước 17:00 (mục tiêu $\ge 98.5\%$).
- **TikTok Shop Fast Dispatch Rate (FDR) & Late Dispatch Rate (LDR):** Chu kỳ gắt gao 6 giờ với đơn Same-Day.
- **Boxme Internal Buffer:** Hệ thống tự động đặt cảnh báo sớm trước 60 phút so với deadline sàn để người chơi có cửa sổ can thiệp.

---

## 4. CƠ CHẾ GAME MECHANICS & NÚT THẮT CỔ CHAI ĐỘNG (Dynamic Bottleneck Engine)

### 4.1 Vòng Lặp Gameplay Cốt Lõi (Core Loop)
Vòng lặp tương tác 5 bước duy trì nhịp độ căng thẳng và phản hồi liên tục:

```
┌────────────────────────────────────────────────────────┐
│  1. SENSE (Quan sát & Cảm nhận)                        │
│  Đọc 14 KPI Cards, Heatmap bãi đệm, Risk Inbox         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  2. TRIAGE (Phân loại & Hy sinh có tính toán)          │
│  Phân tích gốc rễ điểm nghẽn, chấp nhận hy sinh        │
│  chỉ số thứ yếu để bảo toàn mục tiêu sống còn         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  3. INTERVENE (Ra lệnh Can thiệp - Action Cards)       │
│  Tiêu hao Action Points (AP) và Ngân sách OPEX        │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  4. FLOW FEEDBACK (Phản hồi Dòng chảy 3D)              │
│  Dòng hàng di chuyển, âm thanh máy quét, điểm nghẽn    │
│  dịch chuyển sang khâu kế tiếp                         │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  5. DEBRIEF (Tổng kết Ca & Replay Cây Nhánh)          │
│  Chấm điểm Rank S/A/B/C/F, xem đường bay Monte Carlo,  │
│  thử nghiệm phương án rẽ nhánh tối ưu hơn              │
└────────────────────────────────────────────────────────┘
```

### 4.2 Cơ Chế Nút Thắt Cổ Chai Động (Dynamic Bottleneck Engine)
Điểm nghẽn không đứng yên mà tuân theo quy luật bảo toàn dòng chảy có độ trễ:

1. **Pha 1 (08:00 - 10:00):** Tắc tại **Pick Zones** do thiếu thợ nhặt. Queue nhặt hàng dồn ứ.
2. **Người chơi can thiệp:** Điều 12 thợ từ Pack sang Pick.
3. **Pha 2 (10:00 - 11:30):** Hàng nhặt ồ ạt đổ về **IS Buffer**. Đơn Mix 4 món chiếm chỗ, bãi đệm chạm ngưỡng 92% sức chứa $\to$ Xuất hiện Backpressure làm nghẽn luôn khâu Pick!
4. **Người chơi can thiệp:** Đổi thuật toán Pick sang *Nearest Completion First* (nhặt nốt món còn thiếu để giải phóng ô buffer).
5. **Pha 3 (11:30 - 14:00):** Hàng xả từ IS Buffer làm ngập 50 bàn **Pack Banks**.
6. **Người chơi can thiệp:** Kích hoạt 3 bàn dự phòng E1–E3, bật chế độ làm thêm giờ (OT).
7. **Pha 4 (14:00 - 16:30):** Đóng gói xong 12.000 kiện hàng, nhưng xe tải J&T bị trễ. **Handover và Docks** nghẽn cứng, không còn lối đi cho xe nâng hạ pallet!

### 4.3 Hệ Thống Đa Tiền Tệ & Chỉ Số Sức Mạnh (Multi-Currency & Core Attributes)
Nhằm tránh tình trạng "game 1 loại tiền dễ chán và dễ bị hack/lạm phát", hệ thống áp dụng cơ chế 5 trụ cột kinh tế tương hỗ:

```typescript
interface PlayerTycoonState {
  // 1. Tiền Mặt / Vốn Lưu Động (Soft Currency)
  cashBalance: number;          // Tiền mặt giao dịch ca (VNĐ)
  shiftOpexBudget: number;      // Ngân sách dự trù ca
  
  // 2. Điểm Uy Tín Danh Vọng (Prestige Currency)
  reputationStars: number;      // 0.0 - 5.0 sao (Đạt SLA sàn & độ hài lòng của Merchant)
  platformPenaltyPoints: number;// Điểm sao quả tạ từ Shopee/TikTok
  
  // 3. Điểm Sức Mạnh Kho (Hardware Metric)
  totalCbmCapacity: number;     // Tổng thể tích lưu kho (m³)
  availableCbmPower: number;    // Số CBM còn rảnh để nhận thêm khách mới
  warehouseTier: 1 | 2 | 3 | 4 | 5; // Cấp bậc kho hiện tại
  
  // 4. Điểm Đổi Mới Công Nghệ (R&D Currency)
  techSparks: number;           // Điểm mở khóa cây công nghệ (Robot, AI WMS, KCS tự động)
  
  // 5. Thước Đo Tiến Trình (Progression XP)
  opsLevel: number;             // Level người chơi (Level 1 -> 50)
  growthXp: number;             // Điểm kinh nghiệm tích lũy qua từng đơn hàng
  
  // Vận hành nhân sự & thiết bị
  actionPoints: number;         // Điểm hành động (Max 10 AP, hồi 1 AP/15s)
  averageMorale: number;        // Tinh thần công nhân (0 - 100%)
  equipmentHealth: number;      // Độ bền trung bình của máy móc (0 - 100%)
}
```

### 4.4 Lộ Trình 5 Cấp Độ Tiến Hóa Kho Bãi (Warehouse Evolution Tiers)
Người chơi khởi đầu từ một kho bãi nhỏ đơn sơ và từng bước mở rộng thành Siêu Hub tự động hóa:
1. **Tier 1: Kho Vải Bạt Khởi Nghiệp (300m² - 450 CBM):** 2 xe kéo tay, 3 bàn gỗ đóng thủ công, 5 thợ kiêm nhiệm, xử lý 500 đơn/ngày cho 3 shop nhỏ.
2. **Tier 2: Kho Tiêu Chuẩn Ven Đô (2.000m² - 3.500 CBM):** Kệ Selective 3 tầng, 1 xe nâng dầu, máy in nhiệt, 20 thợ chuyên môn, xử lý 3.000 đơn/ngày.
3. **Tier 3: Trung Tâm Hoàn Tất Đô Thị (8.000m² - 16.000 CBM):** Kệ High Bay 5 tầng, xe nâng reach truck tầm cao, băng chuyền con lăn, trạm cân KCS, 60 thợ 2 ca, xử lý 15.000 đơn/ngày.
4. **Tier 4: Siêu Hub Mega Sale VSIP Bắc Ninh (20.000m² - 45.000 CBM):** Sàn Mezzanine 3 tầng, 50 bàn pack, 3 trạm khẩn cấp E1-E3, 6 cửa dock tự động, băng chuyền phân loại máng trượt, 200 thợ, xử lý 50.000–80.000 đơn/ngày.
5. **Tier 5: Siêu Hub Thông Minh Không Đèn (Lights-Out Gigahub 40.000m² - 100.000 CBM):** Cẩu ASRS tự động 18m, 100 robot AMR mang kệ, máy đóng thùng 3D tự động, camera AI kiểm soát 100% gói hàng, xử lý 250.000 đơn/ngày xuyên biên giới.

### 4.5 Vòng Lặp Sự Hài Lòng Của Khách Hàng (Customer Satisfaction & Churn Engine)
Khách hàng là các Merchant có chỉ số cảm xúc và lòng trung thành:
* **Dịch vụ Tốt (SLA > 98.5%, Tỷ lệ lỗi < 0.2%):**
  - Khách hài lòng ($CSAT \ge 90\%$) $\to$ Tự động gia hạn hợp đồng, ký gửi thêm 25% hàng lưu kho (tăng doanh thu lưu kho CBM).
  - Kích hoạt sự kiện **"Word-of-Mouth"**: Đối tác nhãn hàng mới tự động tìm đến ký hợp đồng.
* **Dịch vụ Kém (Trượt SLA, Hàng bẹp vỡ, Giao nhầm):**
  - Khách thất vọng ($CSAT < 60\%$) $\to$ Đánh giá 1 sao, gửi cảnh báo đòi bồi thường.
  - Nếu tiếp tục vỡ trận ($CSAT < 40\%$): **Hủy hợp đồng (Merchant Churn)** $\to$ Rút sạch hàng, để lại diện tích sàn Mezzanine trống rỗng, người chơi mất dòng tiền nhưng vẫn phải trả chi phí thuê mặt bằng cố định.

### 4.6 Khấu Hao Thiết Bị, Bảo Trì & Thưởng Đột Biến (Maintenance & Bonus Injections)
* **Khấu hao & Hỏng hóc (Equipment Wear & Tear):**
  - Băng chuyền con lăn hao mòn $2.5\%/\text{ca}$, xe nâng hao mòn $3\%/\text{ca}$.
  - Khi độ bền $< 30\%$, nguy cơ 35% xảy ra sự cố **"Chết máy giữa ca" (Catastrophic Breakdown)** làm tắc nghẽn cả dây chuyền.
  - Người chơi phải cân đối giữa **Bảo trì Định kỳ (Preventive Maintenance)** giá rẻ trước ca vs **Sửa chữa Khẩn cấp (Emergency Repair)** đắt gấp 3.5 lần khi máy đã cháy động cơ.
* **Các Khoản Thưởng Đột Biến (Bonus Injections):**
  - Thưởng hoàn thành ca Rank S: Thưởng nóng $10\%$ doanh thu ca $+ 50\text{ Tech Sparks}$.
  - Thưởng Đối tác Chiến lược Shopee/TikTok: Giữ SLA > 99% trong 5 ca liên tiếp $\to$ Nhận khoản thưởng đối tác $50.000.000\text{ VNĐ}$.
  - Thưởng Flash Sale Blitz: Xử lý sạch 5.000 đơn trong 90 phút $\to$ Nhận tiền tip nóng từ Merchant.

### 4.7 Bộ Thẻ Lệnh Can Thiệp Quản Lý (Management Action Cards)
- `REALLOCATE_WORKERS`: Chuyển 5 thợ giữa các trạm (Tiêu tốn: 2 AP, Độ trễ di chuyển: 30s).
- `ACTIVATE_EMERGENCY_BENCH`: Mở bàn đóng gói E1/E2/E3 (Tiêu tốn: 3 AP, Chi phí: +250.000 VNĐ/giờ vận hành).
- `PLATFORM_PRIORITY_SURGE`: Ưu tiên tuyệt đối đơn hàng Shopee hoặc TikTok (Tiêu tốn: 2 AP; Hệ quả: Đơn của sàn còn lại bị trôi về cuối queue).
- `CALL_BACKUP_CARRIER_TRUCK`: Thuê xe tải chở hàng ngoài khẩn cấp (Tiêu tốn: 4 AP, Chi phí: +1.500.000 VNĐ/xe; Đón hàng sau 25 phút).
- `DECLARE_SHIFT_OVERTIME`: Kích hoạt ca OT 2 tiếng (Tiêu tốn: 5 AP; Chi phí lương 1.5x–2.0x; Giảm 15% Morale).
- `FAST_TRACK_SINGLE_ITEMS`: Bỏ qua gom đơn, đẩy toàn bộ đơn Single xuất kho trước (Tiêu tốn: 2 AP; Giúp giải tỏa nhanh số lượng lớn đơn cận kề SLA).
- `TRIGGER_PREVENTIVE_MAINTENANCE`: Bảo trì bảo dưỡng toàn bộ máy móc trước ca (Tiêu tốn: $5.000.000\text{ VNĐ}$; Hồi phục 100% độ bền thiết bị).

---

## 5. TÂM LÝ HỌC HÀNH VI & CỖ MÁY GÂY NGHIỆN (The Addiction Engine)

Game tích hợp 7 nguyên lý tâm lý học hành vi để tạo động lực nội tại (Intrinsic Motivation) bền vững:

### 5.1 Thuyết Triển Vọng & Tránh Tổn Thất (Prospect Theory & Loss Aversion)
- Con người sợ mất mát gấp 2.5 lần so với cảm giác nhận thưởng.
- **Thể hiện trong game:** Khi một lô đơn rơi vào vùng nguy cơ vi phạm SLA (dưới 30 phút), không chỉ trừ điểm âm thầm mà kích hoạt cảnh báo trực quan:
  - Kiện hàng và ô sàn nhấp nháy đỏ rực bằng Shader `UnrealBloom`.
  - Bộ đếm tiền phạt nhảy giật lùi theo thời gian thực: `-$2,400 Phạt trễ hạn sàn | Nguy cơ khóa Shop`.
  - Phản xạ sinh tồn (fight-or-flight) thôi thúc người chơi tập trung tối đa giải quyết nút thắt.

### 5.2 Hiệu Ứng "Suýt Soát" (The Near-Miss Effect) & Adrenaline Rush
- Não bộ phóng thích dopamine mạnh nhất khi thoát hiểm trong gang tấc (10–30 giây trước deadline).
- **Cơ chế:** Khi đồng hồ đếm ngược vào 60 giây cuối cùng:
  - Tầng âm thanh nhịp tim dồn dập (audio heartbeat) tăng dần tần số.
  - Khi xe tải lăn bánh rời kho lúc 16:59:45 (SLA 17:00:00), hệ thống kích hoạt hiệu ứng vinh danh: **"SLA ESCAPED! 100% SAVED"** với âm thanh chiến thắng vang dội, mang lại cảm giác xả stress cực lớn.

### 5.3 Hiệu Ứng Zeigarnik & Vòng Lặp Mở (Open Loops)
- Con người bị ám ảnh bởi những công việc chưa hoàn thành.
- **Cơ chế:**
  - Bãi đệm IS Buffer luôn có các đơn dở dang: *"18 đơn đang thiếu đúng 1 SKU từ Zone D"*.
  - Tại cửa Docks, xe tải hiển thị thanh tiến độ: *"94% — Chờ 2 kiện cuối cùng để xuất bến"*.
  - Người chơi tự nhủ *"Chỉ nốt xe tải này thôi mình sẽ nghỉ"*, nhưng ngay khi xe lăn bánh, chiếc xe tiếp theo lại lùi vào cổng dock, triệt tiêu hoàn toàn điểm dừng tự nhiên (stopping cues).

### 5.4 Trạng Thái Dòng Chảy (Flow State) & Audio-Visual ASMR Juice
- **Đạo diễn nhịp độ (Dynamic Pacing Director):** Tự động điều tiết tải để người chơi không bị chán (Boredom) khi quá nhàn rỗi, và không bị sụp đổ tâm lý (Anxiety) khi quá tải. Thả các khoảng nghỉ ngắn (khoảng thở ASMR) giữa các đợt sóng căng thẳng.
- **Sensory Juice:** Tiếng tít của máy quét mã vạch, tiếng con lăn băng tải rào rạo, nhịp chuyển động nhịp nhàng của 3.000 kiện hàng tạo cảm giác thỏa mãn thị giác/thính giác như xếp hình Tetris.

### 5.5 Thuyết Tự Quyết (Self-Determination Theory - SDT)
- **Autonomy (Tự chủ):** Cung cấp cây phân nhánh thời gian **Time-Travel DAG**. Người chơi là chiến lược gia có toàn quyền thử nghiệm các phương án can thiệp.
- **Competence (Năng lực):** Nấc thang thăng tiến từ *Tập sự $\to$ Shift Leader $\to$ Warehouse Supervisor $\to$ Regional Operations Director* cùng hệ thống huy hiệu thành tích.
- **Relatedness (Gắn kết):** Bảng xếp hạng liên kết mạng lưới kho: So sánh hiệu suất giữa VSIP Bắc Ninh, Kho Long An và Kho Samut Prakan (Thái Lan).

### 5.6 Thuyết Củng Cố Biến Đổi (Variable Ratio Reinforcement)
- Xuất hiện các sự kiện may mắn ngẫu nhiên: "Thợ MVP" đạt tốc độ đóng gói x2 trong 3 phút; tài xế xe tải đến sớm 15 phút.
- Cơ chế Quick-Time Event: Người chơi tinh mắt click vào kiện hàng dán nhầm tem trên băng chuyền được thưởng điểm can thiệp xuất sắc.

### 5.7 Hiệu Ứng "Suýt Hoàn Hảo" (The Near-Perfect Replay Trigger)
- Màn hình kết ca (Shift Debrief) xếp hạng Rank S, A, B, C, F.
- Khi người chơi đạt Rank A (98 điểm), hệ thống phóng đại điểm trừ: *"Bạn chỉ thiếu đúng 2 đơn Shopee để đạt Rank S Huyền Thoại!"*. Nỗi tiếc nuối này kích hoạt khao khát bấm nút **"Replay Ca"** ngay lập tức.

---

## 6. HỆ THỐNG KỊCH BẢN THỬ THÁCH (Crisis Engineering & Boss Waves)

Hệ thống kịch bản áp dụng mô hình leo thang 4 pha chuẩn quốc tế:
$$\text{Phase 1: Build-up} \longrightarrow \text{Phase 2: Impact} \longrightarrow \text{Phase 3: Cascade Risk} \longrightarrow \text{Phase 4: Resolution}$$

### 6.1 Kịch Bản 01: "Cơn Lũ Đêm 10.10" (Mega Sale Midnight Surge)
- **Bối cảnh:** 00:00 đêm Mega Sale, đơn hàng sàn đổ vào theo hàm số mũ Logarithmic Spike (+450% trong 15 phút đầu).
- **Phase 1 (23:00 - 00:00):** Tín hiệu ngầm từ API dự báo; bãi đệm buffer còn 75% chỗ trống; 1 băng tải phụ có dấu hiệu kẹt nhẹ.
- **Phase 2 (00:00 - 00:15):** Đơn đổ về 4.500 đơn/phút. Toàn bộ hàng đợi chuyển đỏ. Queue Pick vỡ trận.
- **Phase 3 (00:15 - 01:30):** Bật OT ồ ạt khiến lối đi chật chội, thợ di chuyển chậm 15%. Mở trạm phụ E1-E3 nhưng thiếu QC dẫn đến tỷ lệ đóng gói sai tăng.
- **Phase 4 (01:30 - 02:00):** Tốc độ đơn giảm, người chơi cân đối xả đơn tồn vs cắt giảm chi phí OT.

### 6.2 Kịch Bản 02: "Đứt Gãy Tuyến Vận Tải" (Carrier Highway Breakdown & Dock Choke)
- **Bối cảnh:** Xe tải chính gặp tai nạn trên Quốc lộ 1A lúc 15:30, trễ 90 phút.
- **Phase 1:** API giao thông báo kẹt xe tăng vọt; 2 xe carrier trễ hẹn ETA.
- **Phase 2:** 3 xe tải 8 tấn bị phong tỏa ngoài quốc lộ; 1.800 đơn đối mặt nguy cơ trượt SLA 17:00.
- **Phase 3:** Dock bị choke ngược: Hàng đóng xong không có chỗ chất lên xe, tràn ra lối đi khiến bàn Pack phải dừng hoạt động. Xe dự phòng của đối tác thứ ba tăng giá gấp 2.3 lần.
- **Phase 4:** Đường thông, người chơi tái cấu trúc manifest giao hàng khẩn cấp.

### 6.3 Kịch Bản 03: "Sự Cố Bục Hàng Chất Lỏng & Phong Tỏa Zone C" (Liquid Spill Hazmat Freeze)
- **Bối cảnh:** Kiện hàng nước hoa cồn cao vỡ trong quá trình hạ kệ tại Zone C.
- **Phase 1:** QC ghi nhận thùng hàng ẩm đáy, sàn có vết ướt.
- **Phase 2:** Hóa chất tràn ra 3 pallet, còi báo động PCCC kích hoạt, toàn bộ Zone C bị phong tỏa khẩn cấp 2 tiếng.
- **Phase 3:** 240 đơn cùng zone đối mặt trễ hẹn. Thử thách La bàn Đạo đức (*Moral Compass*): Người chơi có dám ép công nhân vào dọn dẹp khi chưa có đủ đồ bảo hộ PPE không? Nếu ép thợ, điểm An toàn lao động tụt đáy và bị đình chỉ kho.
- **Phase 4:** Hoàn tất xử lý, phân loại hàng hỏng để lập biên bản bảo hiểm merchant.

### 6.4 Kịch Bản 04: "Bẫy Đơn Phức Tạp Multi-Item" (Mix SKU Combinatorial Explosion)
- **Bối cảnh:** Chương trình khuyến mại "Combo 4 món" của nhãn hàng lớn đẩy tỷ lệ đơn Mix từ 22% lên 68%.
- **Phase 1:** Số lượng line item trung bình nhảy từ 1.6 lên 4.2 items/đơn.
- **Phase 2:** IS Buffer chạm ngưỡng 96% dung tích với 2.800 đơn dở dang chờ món cuối. Bãi đệm nghẽn cứng làm đóng băng khâu Pick.
- **Phase 3:** Tái cấu trúc Pick wave theo thuật toán *Nearest Completion First* để cứu bãi đệm, xử lý khiếu nại của các merchant có đơn bị ngâm lâu.
- **Phase 4:** Rút ra bài học AAR về việc phối hợp giữa Marketing và Operations.

---

## 7. KỸ THUẬT MONTE CARLO & TIME-TRAVEL BRANCHING (DAG Tree)

### 7.1 Tính Tất Định Tuyệt Đối (Determinism with Seeded PRNG)
- Toàn bộ các biến ngẫu nhiên trong simulation core sử dụng **Mulberry32 PRNG** nhận seed (ví dụ: `seed = 10102026`).
- Khi người chơi tua lại thời gian để thử nghiệm phương án rẽ nhánh B, mọi biến số môi trường ngoại cảnh (đơn hàng mới, thời tiết, tai nạn giao thông) xảy ra **hoàn toàn giống hệt** phương án A, giúp cô lập chính xác tác động của quyết định quản lý.

### 7.2 Cấu Trúc Nhánh Quyết Định (DAG Tree & Command Pattern)
Mỗi hành động của người chơi là một đối tượng Command có khả năng serialize:

```typescript
interface ManagerActionCommand {
  commandId: string;
  actionType: ManagerActionType;
  executedAtMin: number;
  parameters: Record<string, any>;
  costImpact: number;
  apCost: number;
  execute(state: WarehouseState): void;
  undo(state: WarehouseState): void;
}

interface DecisionNode {
  nodeId: string;
  parentId: string | null;
  timestampMin: number;
  snapshot: WarehouseStateSnapshot;
  actionApplied?: ManagerActionCommand;
  children: string[];
  metrics: {
    slaPerformance: number;
    opexSpent: number;
    cosScore: number;
  };
}
```

### 7.3 Mô Phỏng Monte Carlo Ngầm Trên Web Worker
- Gói headless của Simulation Core chạy trên Web Worker độc lập với luồng render Three.js.
- Chạy 500 kịch bản ngẫu nhiên trong 800ms để trả về dải phân vị xác suất:
  - $P_{10}$: Kịch bản thuận lợi nhất.
  - $P_{50}$: Kịch bản trung vị (kỳ vọng).
  - $P_{90}$: Kịch bản rủi ro cao.
  - $P_{99}$: Kịch bản khủng hoảng tồi tệ nhất.
- Đưa ra khuyến nghị can thiệp trực tiếp trên Inspector UI kèm tỷ lệ rủi ro có cơ sở xác suất.

---

## 8. HỆ THỐNG ĐÁNH GIÁ & CHUYỂN GIAO NĂNG LỰC THỰC TẾ (Operations Scorecard)

### 8.1 Điểm Tổng Hợp Vận Hành (Composite Operations Score - COS)
$$COS = (SLA\_Rate \times 0.35) + (Cost\_Efficiency \times 0.25) + (Safety\_Morale \times 0.25) + (Inv\_Accuracy \times 0.15)$$

Trong đó mỗi chỉ số được chuẩn hóa trên thang điểm $0 - 100$:
1. **$SLA\_Rate$ ($35\%$):** Tỷ lệ đơn hoàn tất trước deadline Shopee FHR và TikTok FDR.
2. **$Cost\_Efficiency$ ($25\%$):** Tỷ lệ kiểm soát ngân sách: $100 - \max\left(0, \frac{\text{Chi phí thực tế} - \text{Ngân sách}}{\text{Ngân sách}} \times 100\right)$.
3. **$Safety\_Morale$ ($25\%$):** Mức độ bảo vệ thể lực công nhân ($f_{\text{fatigue}}$) và tuân thủ an toàn lao động PCCC/SOP.
4. **$Inv\_Accuracy$ ($15\%$):** Tỷ lệ đơn đóng gói không có lỗi sai hàng, rách hộp hoặc dán nhầm tem.

### 8.2 Ma Trận Phân Hạng (Rank Matrix)
- **Rank S (95 - 100 điểm):** Huyền thoại Vận hành. Cứu 100% SLA với chi phí phát sinh $< 5\%$.
- **Rank A (85 - 94 điểm):** Xuất sắc. Vận hành vững vàng, chi phí hợp lý.
- **Rank B (70 - 84 điểm):** Đạt yêu cầu. Có một số đơn trễ nhẹ nhưng không vỡ trận.
- **Rank C (50 - 69 điểm):** Kém. Lạm phát chi phí OT, công nhân kiệt sức, tỷ lệ lỗi cao.
- **Rank F ($< 50$ điểm):** Vỡ trận hoàn toàn. Bị sàn hạ chỉ số Shop hoặc đình chỉ kho.

### 8.3 Serious Game Learning Transfer & After Action Review (AAR)
Sau mỗi ca làm việc, màn hình AAR cung cấp:
- **Biểu đồ Đối chiếu Quyết định:** So sánh đường bay của người chơi với đường bay tối ưu của thuật toán.
- **Khoảnh khắc Bùng phát Điểm nghẽn (Aha-moment):** Chỉ rõ quyết định ở phút thứ 45 đã gây ra hậu quả nghẽn bãi đệm ở phút thứ 90 như thế nào.
- Rèn luyện **Trực giác Vận hành (Operational Intuition)** cho đội ngũ quản lý kho Boxme mà không gây rủi ro thiệt hại đơn hàng thực tế.

---

## 9. PIPELINE ĐỒ HỌA 3D & THIẾT KẾ ÂM THANH ĐA TẦNG

### 9.1 Tối Ưu Hóa Dựng Hình 3D Hiệu Năng Cao (Draw Call Optimization)
- **`THREE.InstancedMesh`:**
  - 3.000 hộp carton (màu Kraft, Shopee cam, TikTok đen) gói trọn trong **1 Draw Call duy nhất**.
  - 200 nhân công với tư thế động (nhặt hàng, đóng gói, đẩy xe) quản lý qua Instance Matrix và Color Buffer.
- **Static Geometry Merging:** Toàn bộ hệ thống kệ High Bay, vách nhà xưởng và hàng rào gộp bằng `BufferGeometryUtils.mergeGeometries()`.
- **ACESFilmic Tone Mapping & N8AO:** Tạo bóng đổ tiếp xúc sắc nét dưới gầm pallet, chân kệ và gầm xe tải.
- **Selective UnrealBloom:** Phát sáng viền cảnh báo đèn xe nâng và ô sàn đang ở mức `Critical`.

### 9.2 Thiết Kế Âm Thanh Đa Tầng (Multi-Layered Audio Engine)
Hệ thống âm thanh Web Audio API phản ánh nhịp tim của nhà kho:
1. **Tầng Nền (Ambient Layer):** Tiếng quạt thông gió công nghiệp, tiếng động cơ xe nâng từ xa, tiếng con lăn băng tải rào rạo.
2. **Tầng Phản Hồi Vi Mô (Micro-Reward Layer):** Tiếng *"tít"* giòn tan khi súng barcode quét mã thành công, tiếng *"bộp"* đầm chắc khi dán tem niêm phong hộp.
3. **Tầng Cảnh Báo Căng Thẳng (Tension Layer):** Tiếng nhịp tim dồn dập (Adrenaline Heartbeat) khi đồng hồ đếm ngược SLA vào 60 giây cuối.
4. **Tầng Chiến Thắng (Fanfare Layer):** Âm thanh giải tỏa cảm xúc khi xe tải chốt cổng xuất bến an toàn.

---

## 10. GIAO DIỆN NGƯỜI DÙNG & ĐA NGÔN NGỮ (UI/UX & i18n)

### 10.1 Bố Cục Bàn Điều Hành (Mission Control Layout)
- **Header Bar:** Thương hiệu Boxme, Đồng hồ mô phỏng, Chỉ báo ca (Ca A/B), Bộ tốc độ (x1, x5, x15, x60), Bộ chọn ngôn ngữ (VI/EN/TH/ZH).
- **Metric Ribbon (14 KPI Cards):** Received, Released, Picked, Waiting IS, Packed, Handed, SLA Risk, Boxme FHR, Shopee FHR, TikTok FDR, TikTok LDR, Pack Cap %, Pick Cap %, Carrier Risk.
- **Left Panel - Risk Inbox:** Sắp xếp rủi ro theo mức độ nghiêm trọng, hiển thị nguyên nhân và khuyến nghị xử lý.
- **Center Viewport - 3D Canvas:** Tích hợp các widget nổi (Xe trên bãi, Cửa dock bận, Nhân sự trên sàn, Stepper tiến trình Flow).
- **Right Panel - Tactical Inspector:** Cây phân tích nguyên nhân gốc rễ, Bán kính rủi ro SLA, Dự báo thông lượng và Bộ Action Cards can thiệp.
- **Bottom Bar - Time-Travel Timeline:** Thanh trượt tua thời gian, vạch cảnh báo sự cố, cây nhánh DAG và nút kích hoạt Monte Carlo.

### 10.2 Chuẩn Hóa Đa Ngôn Ngữ Quốc Tế (i18n)
Hỗ trợ đầy đủ 4 ngôn ngữ chiến lược của Boxme:
- `vi`: Tiếng Việt (VSIP Bắc Ninh, Kho Long An, Kho Củ Chi).
- `en`: English (Chuẩn quản trị logistics quốc tế).
- `th`: ภาษาไทย (Kho Samut Prakan / Bangkok, Thái Lan).
- `zh`: 简体中文 (Khách hàng thương mại điện tử xuyên biên giới Cross-border).
- Thiết kế giao diện co giãn chống tràn chữ (Text Expansion Handling: Tiếng Việt và Tiếng Thái dài hơn Tiếng Anh 25–35%).

---

## 11. CẤU TRÚC MÃ NGUỒN MÔ-ĐUN HÓA CHI TIẾT (Source Code Architecture)

```
src/
├── main.tsx
├── App.tsx
│
├── simulation/                  # [Lõi Mô Phỏng Độc Lập]
│   ├── engine.ts                # Discrete timestep engine (10-20Hz)
│   ├── prng.ts                  # Mulberry32 deterministic generator
│   ├── queueModel.ts            # Queue theory & stage transitions
│   ├── bottleneckEngine.ts      # Dynamic Bottleneck & Backpressure logic
│   ├── fatigueModel.ts          # Worker stamina, morale & error rate math
│   ├── slaPredictor.ts          # SLA calculations (FHR, FDR, LDR)
│   ├── dataImporter.ts          # JSON/CSV/WMS parameters loader
│   ├── scenarios/               # Khủng hoảng & Boss Waves
│   │   ├── megaSale1010.ts      # Kịch bản bão đơn đêm sale
│   │   ├── carrierBreakdown.ts  # Kịch bản kẹt xe quốc lộ
│   │   ├── hazmatSpill.ts       # Kịch bản vỡ hàng hóa mỹ phẩm
│   │   └── multiItemChoke.ts    # Kịch bản bùng nổ đơn combo
│   └── monteCarlo/              # Web Worker Parallel Simulator
│       ├── mcWorker.ts          # Headless worker runner
│       └── distributions.ts     # Box-Muller, Poisson, Lognormal
│
├── game/                        # [Cơ Chế Game & Quyết Định]
│   ├── actionManager.ts         # Command Pattern implementation
│   ├── actionCards.ts           # Định nghĩa các thẻ lệnh can thiệp
│   ├── snapshotDag.ts           # State tree for time-travel & branching
│   ├── scoreEvaluator.ts        # Composite Operations Score (COS)
│   ├── pacingDirector.ts        # Dynamic pacing & emotional neuro-tuning
│   └── gameLoop.ts              # Fixed tick vs RAF coordination
│
├── audio/                       # [Hệ Thống Âm Thanh Đa Tầng]
│   ├── soundEngine.ts           # Web Audio API context & bus mixer
│   ├── sfxCatalog.ts            # Barcode ding, conveyor hum, heartbeat
│   └── audioJuice.ts            # Sound triggers on game events
│
├── engine/                      # [Engine Đồ Họa Three.js]
│   ├── WarehouseEngine.ts       # Main WebGL lifecycle & render loop
│   ├── CameraManager.ts         # Tactical Isometric, Chase, Cutaway
│   ├── LightingSystem.ts        # Hemi, Sun shadow caster, fill light
│   ├── PostProcessing.ts        # N8AO, Selective Bloom, ACESFilmic
│   ├── materials/               # Epoxy floor, roller conveyors, boxes
│   ├── shaders/                 # Risk pulse ring, zone boundary box
│   └── entities/                # Procedural 3D modules
│       ├── Building.ts          # Walls, canopy, animated dock doors
│       ├── RackSystem.ts        # High bays, pack benches, pick zones
│       ├── FleetTrucks.ts       # Articulated trucks & routes
│       ├── Forklifts.ts         # Animated forklifts & pallet lifts
│       ├── Conveyors.ts         # UV animated rollers & belt boxes
│       ├── WorkerCrowd.ts       # InstancedMesh animated workers
│       └── BoxInstances.ts      # InstancedMesh dynamic box stacks
│
├── stores/                      # [Zustand State Stores]
│   ├── simulationStore.ts       # Clock, playback speed, paused state
│   ├── decisionStore.ts         # DAG History, active branch, actions
│   ├── economyStore.ts          # OPEX budget, Action Points, Morale
│   ├── kpiStore.ts              # Real-time KPI metrics
│   └── uiStore.ts               # Camera mode, active drawer, language
│
├── i18n/                        # [Đa Ngôn Ngữ]
│   ├── index.ts                 # i18next configuration
│   └── locales/                 # vi.json, en.json, th.json, zh.json
│
└── components/                  # [React 19 Components]
    ├── header/                  # Mission control top bar & speed controls
    ├── kpis/                    # 14 KPI Cards & SLA Countdown
    ├── riskInbox/               # Risk cards list with action buttons
    ├── inspector/               # Tactical root-cause tree & Action Cards
    ├── timeline/                # Time scrubber & DAG branching buttons
    ├── debrief/                 # Shift Grade (S/A/B/C/F) & AAR modal
    ├── modals/                  # Monte Carlo chart & Data Importer
    └── viewport/                # Canvas container & floating quick HUD
```

---

## 12. LỘ TRÌNH TRIỂN KHAI THEO GIAI ĐOẠN (Implementation Roadmap)

| Giai đoạn | Trọng tâm công việc | Kết quả đầu ra |
|---|---|---|
| **Phase 1: Foundation & Core Logic** | Triển khai Discrete Simulation Engine, Mulberry32 PRNG, Dynamic Bottleneck Engine và Fatigue Model. | Engine tính toán headless chạy độc lập, kiểm thử đơn vị logic hàng đợi và tính tất định. |
| **Phase 2: Decision Sandbox & Time-Travel** | Xây dựng Command Pattern, Action Cards, Snapshot DAG Tree và Monte Carlo Web Worker. | Khả năng tua ngược thời gian, rẽ nhánh thử nghiệm phương án A/B và chạy 500 kịch bản ngẫu nhiên. |
| **Phase 3: 3D Visualization & Sensory Juice** | Nâng cấp Three.js pipeline, InstancedMesh hộp/thợ, N8AO, Selective Bloom, Camera Tweens và Web Audio API. | Đồ họa 3D isometric mượt mà 60-120 FPS kèm âm thanh quét mã, nhịp tim SLA và hiệu ứng thỏa mãn thị giác. |
| **Phase 4: Game Modes, UI & i18n** | Hoàn thiện 4 kịch bản Boss Waves, Giao diện Mission Control React 19, Scorecard COS, Shift Debrief và i18n (VI/EN/TH/ZH). | Bản phát hành hoàn chỉnh Boxme Mission Control 2.0 đưa lên Cloudflare Pages. |

---

© 2026 Boxme Global Fulfillment Platform. All rights reserved.
Tài liệu thuộc bản quyền kiến trúc Boxme Mission Control 2.0.
