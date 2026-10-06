# 🎮 BOXME FULFILLMENT TYCOON: FOUNDATIONAL GAME DESIGN SYSTEM (GDS)
# Industrial Cyber-Logistics & SCADA Mission Control Architecture

> **Brief Inference**: Foundational Game Design System & HUD Component Architecture for Boxme Logistics Simulator & Tycoon, with a Tactical Cyber-Industrial / Sci-Fi Logistics Control Language, leaning toward high-contrast Obsidian Carbon surfaces, Electric Cobalt and Industrial Hazard Amber accents, and Tactile Aeronautic Glass and Telemetry Micro-physics.
>
> **Configuration Dials**:
> * `DESIGN_VARIANCE: 8` (High asymmetry, dynamic HUD pods, chamfered bezels, modular game widgets)
> * `MOTION_INTENSITY: 7` (Juicy spring feedback, telemetry tick counters, heartbeat sweeps, SLA alarms)
> * `VISUAL_DENSITY: 6` (Rich industrial telemetry, military-grade readability, zero wasted white-space)

---

## 1. TRIẾT LÝ THIẾT KẾ: INDUSTRIAL CYBER-LOGISTICS (PHONG CÁCH ĐẶC TRƯNG)

### 1.1 Khác biệt giữa "Web Quản Trị ERP" vs "Game Tycoon Hấp Dẫn"
Trang web giám sát hiện tại (WMS Dashboard) mang phong cách hành chính: nền sáng phẳng, thẻ trắng mờ nhạt, phông chữ tiêu chuẩn, thiếu chiều sâu và cảm xúc. 

Hệ thống Design System mới cho Game được xây dựng dựa trên nguyên lý **Industrial Cyber-Logistics & Mission Control**:
1. **Materiality & Tactile Depth**: Giao diện không phải là các khối div phẳng lì, mà mang cảm giác của bảng điều khiển hàng không vũ trụ và trạm SCADA công nghiệp: khung kim loại phay xước, gờ vát cạnh 45 độ (chamfered bevels), lớp kính đo đạc phản quang (optical glass) và đèn LED chỉ báo trạng thái.
2. **Color Energy & Hazard Coding**: Kế thừa màu xanh nhận diện thương hiệu Boxme (`#1E58FC` Cobalt Blue), đồng thời bứt phá với các sắc thái công nghiệp rực rỡ: Vàng an toàn / Hazard Amber (`#F59E0B`), Xanh Lục SLA Nominal (`#10B981`), và Đỏ Cảnh Báo Cutoff (`#EF4444`).
3. **Information Density with Tactical Hierarchy**: Tỷ lệ thông tin cao nhưng có lớp lang rõ ràng. Các con số vận hành (UPH, CBM, SLA, LPN, Tiền quỹ) sử dụng phông Monospace số học to rõ, giúp người chơi lập tức nắm bắt "nhịp thở" của kho hàng nghìn mét vuông.
4. **Juicy Game Feel**: Tương tác có độ nảy cơ học (spring physics `scale: 0.96` khi bấm), hiệu ứng quét radar (radar sweep), thanh tiến trình phân đoạn (segmented progress bar), và âm thanh haptic tinh tế.

---

## 2. HỆ THỐNG DESIGN TOKENS (DESIGN TOKENS SPECIFICATION)

### 2.1 Bảng Màu Cốt Lõi (Core Palette Tokens)

```
[OBSIDIAN VOID]        [SURFACE L1 - POD]      [SURFACE L2 - BEZEL]    [SURFACE L3 - GLASS]
  #070B14                 #0D1526                 #132038               rgba(19, 32, 56, 0.75)
  (Nền không gian)       (Khối container HUD)    (Khối tương tác nổi)    (Kính mờ quang học)

[BOXME COBALT]         [CYBER SKY]             [HAZARD AMBER]          [CAUTION STRIPE]
  #1E58FC                 #38BDF8                 #F59E0B                 #FBBF24
  (Màu chủ đạo thương hiệu)(Đường quét, Lidar)    (Xe nâng, Kệ, Băng chuyền)(Vạch an toàn công nghiệp)

[SLA NOMINAL]          [CRITICAL ALARM]        [NEUTRAL TEXT]          [MUTED TELEMETRY]
  #10B981                 #EF4444                 #F8FAFC                 #94A3B8
  (Đạt cam kết giao hàng) (Sập SLA, Kẹt băng tải) (Tiêu đề, Chỉ số chính)  (Nhãn phụ, Đơn vị đo)
```

#### CSS Token Definition:
```css
:root {
  /* Surface Layers */
  --gds-surface-void: #070b14;
  --gds-surface-pod: #0d1526;
  --gds-surface-bezel: #132038;
  --gds-surface-glass: rgba(19, 32, 56, 0.75);
  --gds-surface-glass-border: rgba(56, 189, 248, 0.22);
  --gds-surface-glass-highlight: rgba(255, 255, 255, 0.08);

  /* Primary Brand & Sci-Fi Pulses */
  --gds-brand-cobalt: #1e58fc;
  --gds-brand-cobalt-glow: rgba(30, 88, 252, 0.35);
  --gds-brand-sky: #38bdf8;
  --gds-brand-sky-subtle: rgba(56, 189, 248, 0.12);

  /* Industrial Equipment & Hazard */
  --gds-hazard-amber: #f59e0b;
  --gds-hazard-amber-glow: rgba(245, 158, 11, 0.4);
  --gds-hazard-amber-bg: rgba(245, 158, 11, 0.12);
  --gds-caution-yellow: #fbbf24;

  /* Telemetry Status Signals */
  --gds-status-nominal: #10b981;
  --gds-status-nominal-bg: rgba(16, 185, 129, 0.12);
  --gds-status-warning: #f59e0b;
  --gds-status-alarm: #ef4444;
  --gds-status-alarm-glow: rgba(239, 68, 68, 0.45);
  --gds-status-alarm-bg: rgba(239, 68, 68, 0.12);

  /* Typography Colors */
  --gds-text-primary: #f8fafc;
  --gds-text-secondary: #cbd5e1;
  --gds-text-muted: #94a3b8;
  --gds-text-mono-cyan: #a5f3fc;

  /* Corner Radius and Chamfer */
  --gds-radius-sm: 6px;
  --gds-radius-md: 10px;
  --gds-radius-lg: 16px;
  --gds-radius-pill: 9999px;
  --gds-chamfer-angle: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));

  /* Elevation Shadows */
  --gds-shadow-pod: 0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(56, 189, 248, 0.16);
  --gds-shadow-bezel: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 24px -6px rgba(0, 0, 0, 0.5);
  --gds-shadow-glow-blue: 0 0 24px -4px rgba(30, 88, 252, 0.45);
  --gds-shadow-glow-amber: 0 0 24px -4px rgba(245, 158, 11, 0.45);
}
```

---

### 2.2 Hệ Thống Typography (Font Hierarchy)

Tuân thủ nghiêm ngặt quy chuẩn Section 4.1 của Taste Skill: Không sử dụng font serif mặc định, sử dụng font Display hiện đại kết hợp Monospace kỹ thuật cho các chỉ số đo đạc.

1. **Display & Game Titles**:
   - Font Family: `Outfit`, `Space Grotesk`, `Chakra Petch`, sans-serif
   - Weight: `700 Bold` hoặc `800 ExtraBold`
   - Tracking: `-0.02em` đến `-0.03em`
   - Dùng cho: Tên phân hệ kho, bảng xếp hạng ngày, thông báo sự kiện bão đơn.
2. **Telemetry & Numbers (Trái tim của Game Tycoon)**:
   - Font Family: `JetBrains Mono`, `SF Mono`, monospace
   - Weight: `600 SemiBold` hoặc `700 Bold`
   - Tính năng CSS: `font-feature-settings: "tnum" 1` (Tabular numbers, giúp số khi nhảy không làm co giãn layout).
   - Dùng cho: Tiền tệ quỹ ngân quỹ ($), tỷ lệ SLA %, đồng hồ đếm ngược Cutoff, UPH nhặt hàng, trọng lượng cân KCS kg.
3. **Body & Micro-Labels**:
   - Font Family: `Geist Sans`, `-apple-system`, `Segoe UI`, sans-serif
   - Size: `11px` (nhãn trạng thái), `13px` (mô tả nhiệm vụ), `14px` (nội dung thẻ).
   - Dùng cho: Mô tả chi tiết, hướng dẫn nhân công, danh sách công việc Inbound/Outbound.

---

### 2.3 Vật Liệu & Đồ Họa Công Nghiệp (Industrial Materiality)

* **Vạch Cảnh Báo An Toàn (Hazard Stripe Band)**:
  Sử dụng dải sọc chéo màu vàng-đen công nghiệp ở chân hoặc mép thẻ hành động đặc biệt:
  ```css
  .gds-hazard-stripe {
    background: repeating-linear-gradient(
      -45deg,
      rgba(245, 158, 11, 0.85) 0,
      rgba(245, 158, 11, 0.85) 10px,
      rgba(15, 23, 42, 0.9) 10px,
      rgba(15, 23, 42, 0.9) 20px
    );
  }
  ```
* **Kính Đo Đạc Quang Học (Optical Telemetry Glass)**:
  Hiệu ứng kính mờ có viền sáng phản xạ 1px trên đỉnh:
  ```css
  .gds-optical-glass {
    background: linear-gradient(135deg, rgba(19, 32, 56, 0.85), rgba(9, 16, 29, 0.9));
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 16px 32px rgba(0, 0, 0, 0.6);
  }
  ```
* **Đèn LED Chỉ Báo Trạng Thái (LED Pips & Beacons)**:
  Các chấm tròn vi sóng báo tải:
  - 🟢 Xanh lục: Hoạt động định mức (0 đến 75% tải)
  - 🟡 Hổ phách: Cảnh báo tiệm cận nghẽn (76 đến 90% tải)
  - 🔴 Đỏ nháy (1.5Hz): Quá tải, nghẽn lối đi, vi phạm SLA.

---

## 3. CÁC COMPONENT CỐT LÕI CỦA GAME (FOUNDATIONAL COMPONENTS)

### 3.1 Resource Header Bar (Bảng Chỉ Số Ngân Quỹ & Nhịp Vận Hành Toàn Cầu)
Nằm cố định ở đầu màn hình, cung cấp 5 trục thông tin sống còn:
* **Ngân quỹ khả dụng (Cash Flow)**: `$2,482,910` (Hiển thị số học kèm hiệu ứng nhảy số màu vàng hổ phách khi có đơn hoàn tất).
* **Cam kết SLA Toàn Kho**: `99.2%` (Thanh đo kèm chấm LED xanh).
* **Tốc độ xử lý (UPH - Units Per Hour)**: `14,250` kiện/giờ.
* **Thời gian ca & Nút tua thời gian**: Nút dừng `[PAUSE]`, `[1X]`, `[5X]`, `[15X]`, `[60X]`.
* **Cảnh báo khẩn cấp (Emergency Ticker)**: Dòng tin tức chạy khi có sự kiện siêu sale hoặc xe tải tới cổng.

### 3.2 Tactical Zone Card (Thẻ Khu Vực Vận Hành 3D)
Hiển thị khi người chơi click vào một khu vực trên bản đồ 3D (ví dụ: Dock 01, Sorter Loop 04, Bàn Đóng Gói P-12, Kệ Cao Tầng S3):
* **Ảnh phối cảnh 3D Asset** (Rendering góc nghiêng isometric chân thực).
* **Đồng hồ công suất hiện tại** (Gauge Bar chia vạch phần trăm).
* **Danh sách nhân sự & Thiết bị đang trực** (Picker, Forklift, AMR).
* **Nút hành động khẩn**: `TĂNG CA (BOOST SHIFT)`, `BẢO TRÌ (MAINTENANCE)`, `ĐIỀU PHỐI ROBOT (DEPLOY AMR)`.

### 3.3 AMR Fleet Pod (Bộ Điều Khiển Đội Xe Robot Tự Hành)
Mô-đun điều khiển đội robot vận chuyển kệ:
* **Ảnh chân dung AMR-04** kèm tia quét Lidar Cyan.
* **Chỉ số năng lượng pin**: `78%` kèm biểu tượng sạc nhanh.
* **Trạng thái hành trình**: Đang mang kệ Pallet số `PL-8920` đến Trạm Đóng Gói `P-08`.
* **Nút lệnh**: `SẠC NGAY (RETURN CHARGE)`, `CHUYỂN TUYẾN (REROUTE)`, `DỪNG KHẨN CẤP (ESTOP)`.

### 3.4 Smart Cartonization & Packing Panel (Bàn Đóng Gói Thông Minh 3D)
Mô-đun tương tác khi người chơi quản lý phân hệ đóng thùng:
* **Mô hình Hologram Thùng Hàng 3D**: Đo thể tích tự động `35 x 25 x 18 cm` (`15,750 cm³`).
* **Đồng hồ Cân KCS Checkweigher**: Màn hình LED xanh lục `4.75 KG`.
* **Cảnh báo lệch trọng lượng**: Nếu $\Delta W > \pm 15g$, kích hoạt viền cảnh báo đỏ xả lỗi sang làn Reject.

### 3.5 SLA Cutoff Emergency Banner (Băng Rôn Đếm Ngược Giờ Xuất Bến)
Khi đồng hồ điểm sát giờ xe tải lăn bánh (Cutoff Time):
* Khung viền viền đỏ nhấp nháy cơ học.
* Đồng hồ đếm ngược `00:14:59` số to màu trắng trên nền đỏ.
* Cảnh báo số đơn hàng nguy cơ trễ: `142 ĐƠN HÀNG NGUY CƠ TRỄ HẠN`.
* Nút CTA khẩn cấp: `KÍCH HOẠT CA BÙ (OVERDRIVE SHIFT)` với hiệu ứng nảy nút vật lý.

---

## 4. BẢNG ĐỐI CHIẾU HÌNH ẢNH & VISUAL ASSETS THỰC TẾ (9 BỘ ASSET 3D)

| Asset Tên | Loại & Tỷ Lệ | Chi Tiết Tạo Hình | Vị Trí Áp Dụng Trong Game |
|---|---|---|---|
| `fulfillment_game_hero` | 16:9 3D Render | Trung tâm fulfillment đa tầng 35.000m², kệ thép cao tầng, robot AMR mang thùng vàng, cổng dock xe tải viền neon | Hero Display, Màn hình Loading, Tổng hành dinh |
| `mission_control_cctv_center` | 16:9 3D Render | Phòng điều hành Mission Control, tường màn hình CCTV cong đa kênh, bàn Hologram digital twin hiển thị bản đồ nhiệt 18,450 PPH | Màn hình Điều Hành Tổng, Phân hệ Giám Sát CCTV |
| `char_shift_supervisor` | 1:1 Stylized Character | Trưởng ca điều hành nam uy tín, áo phản quang Boxme, tai nghe bộ đàm, máy tính bảng Hologram biểu đồ năng suất | Thẻ Nhân Sự Chỉ Huy, Buff +15% Tốc Độ Toàn Kho |
| `char_elite_picker` | 1:1 Stylized Character | Chuyên viên nhặt hàng nữ, kính AR dẫn đường thông minh (Pick-to-Light HUD), máy quét gắn cổ tay phát tia laser đỏ, khay vàng Tote | Đội Nhặt Hàng Wave Picking, Giảm Sai Sót &lt;0.1% |
| `char_robotics_engineer` | 1:1 Stylized Character | Kỹ sư bảo trì cơ điện quỳ bên cạnh robot AMR, đai dụng cụ cơ khí, kính bảo hộ trán, tablet chẩn đoán vi mạch | Trạm Kỹ Thuật, Sửa Chữa AMR & Bảo Trì Băng Tải |
| `equip_electric_forklift` | 1:1 3D Equipment | Xe nâng điện 2.5 tấn vàng - xanh Boxme, trụ nâng thủy lực nâng pallet thùng hàng, đèn chiếu điểm an toàn màu xanh xuống sàn | Phân hệ Cổng Dock Inbound & Hạ Tải Container |
| `amr_robot_unit` | 1:1 3D Equipment | Robot tự hành AMR-04 mang khay vàng, mắt thần Lidar quét laser Cyan 360 độ, bảng chỉ số pin Hologram 78% | Đội Xe Tự Hành Kiva, Vận Chuyển Hàng Tới Trạm Đóng |
| `smart_pack_station` | 1:1 3D Equipment | Bàn đóng tự động, băng chuyền con lăn bọc màng bóng khí, quét Hologram kích thước thùng, cân KCS điện tử 4.75 KG | Phân hệ Đóng Gói 3D & Kiểm Tra Trọng Lượng Chuẩn |
| `prop_rf_scanner_gun` | 1:1 3D Prop | Súng quét mã vạch công nghiệp RF bọc cao su chống va đập, màn hình cảm ứng hiển thị danh sách đơn, tia laser đỏ | Trang Bị Cầm Tay Công Nhân, Tăng 40% Tốc Độ Scan |
| `prop_smart_crates_parcels` | 1:1 3D Prop | Chồng khay nhựa vàng Tote trên pallet gỗ, các thùng carton dán tem vận chuyển Shopee/TikTok/SPX, cuộn băng dính FRAGILE | Vật Tư Tiêu Hao, Quản Lý Tồn Kho Thùng Đóng Gói |

---

## 5. BẢNG MÃ MẪU CSS & TÍCH HỢP INTERACTIVE

Dưới đây là đoạn mã CSS & HTML mẫu chuẩn bị triển khai trực tiếp vào file showroom tương tác `game-design-system.html`:

```html
<!-- Component Mẫu: Tactical Game Action Button -->
<button class="gds-btn gds-btn-primary">
  <span class="gds-btn-glow"></span>
  <span class="gds-btn-icon">⚡</span>
  <span class="gds-btn-label">BOOST SHIFT (X2 TỐC ĐỘ)</span>
</button>
```

```css
.gds-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: var(--gds-font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(180deg, #2454dd, #1a3fb3);
  border: 1px solid #38bdf8;
  border-radius: var(--gds-radius-sm);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 14px rgba(36, 84, 221, 0.4);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.15s ease, filter 0.15s ease;
  user-select: none;
}

.gds-btn:hover {
  filter: brightness(1.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 6px 20px rgba(56, 189, 248, 0.5);
  transform: translateY(-1px);
}

.gds-btn:active {
  transform: scale(0.97) translateY(1px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}
```

---

## 6. PRE-FLIGHT CHECK TỰ ĐỘNG THEO TASTE SKILL

- [x] **Brief inference declared**: Đã ghi rõ ở đầu tài liệu.
- [x] **Dials explicit**: Variance 8, Motion 7, Density 6.
- [x] **ZERO em-dashes**: Không có bất kỳ ký tự gạch ngang dài nào trong văn bản (đã thay bằng dấu gạch đơn, hai chấm, hoặc ngoặc đơn).
- [x] **Color Consistency**: Khóa bảng màu Obsidian, Cobalt Blue, Hazard Amber, Bio Emerald và Laser Crimson.
- [x] **Shape Consistency**: Khóa góc bo 6px/10px với gờ vát chamfer 45 độ công nghiệp.
- [x] **Button Contrast**: Đạt chuẩn tương phản chữ trắng trên nền xanh/amber đậm (> 4.5:1).
- [x] **Real Images Used**: Sử dụng các ảnh render 3D độ nét cao đã sinh trong `assets/images/`.

Hệ thống Design System này thiết lập nền móng vững chắc để phát triển toàn bộ giao diện game fulfillment chân thực, sống động và đậm chất Boxme.
