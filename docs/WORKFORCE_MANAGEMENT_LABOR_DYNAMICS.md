# 👥 QUẢN TRỊ NHÂN SỰ & THỊ TRƯỜNG LAO ĐỘNG KHO VẬN (WORKFORCE DYNAMICS)
## Fulldy Center — Labor Economics, Temp Agency & Retention Engine

* **Mã đặc tả:** WORKFORCE-LABOR-2026-10-06
* **Phiên bản:** 1.0.0
* **Tác giả:** Antigravity Team & Fulldy Operations HR Group
* **Mục tiêu:** Mô phỏng chân thực bài toán "đau đầu nhất" của mọi Giám đốc kho bãi: Khó tuyển người, cạnh tranh tăng lương, nhân sự nghỉ ngang vô cớ, và canh bạc thuê lao động thời vụ mùa Siêu Sale (thiếu người vỡ trận vs thừa người lỗ vốn).

---

## 1. MÔ HÌNH LAO ĐỘNG HAI TẦNG (TWO-TIER WORKFORCE MODEL)

Hệ thống phân định rạch ròi giữa 2 lực lượng lao động với đặc tính tâm lý và chi phí hoàn toàn khác biệt:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HỆ THỐNG LAO ĐỘNG KHO VẬN fulldy                      │
├───────────────────────────────────┬────────────────────────────────────┤
│   LAO ĐỘNG CHÍNH THỨC (CORE)      │    LAO ĐỘNG THỜI VỤ (TEMP/CASUAL)  │
├───────────────────────────────────┼────────────────────────────────────┤
│ - Hợp đồng dài hạn, lương tháng   │ - Hợp đồng nhật vụ / theo ca Sale  │
│ - Tích lũy Kinh nghiệm & Thâm niên│ - Không quen sơ đồ kho & quy trình │
│ - Năng suất cao (100 - 160 WPH)   │ - Năng suất thấp (45 - 75 WPH)     │
│ - Tỷ lệ lỗi cực thấp (< 0.1%)     │ - Tỷ lệ dán nhầm tem cao (1.5 - 3%)│
│ - Rủi ro: So bì lương, chán việc, │ - Rủi ro: Bùng ca (No-show 15-35%),│
│   nghỉ ngang sau 3 ngày làm thử   │   thừa người khi đơn sàn không về  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. LAO ĐỘNG CHÍNH THỨC: TUYỂN DỤNG, TĂNG LƯƠNG & BỎ VIỆC BẤT NGỜ

### 2.1 Thị Trường Lao Động Cạnh Tranh (Industrial Park Labor Market)
Kho fulldy VSIP Bắc Ninh (hoặc Long An, Samut Prakan) nằm giữa các đại công xưởng (Samsung, Foxconn, Shopee SPX, Lazada Logistics):
- **Cơ chế Lương Thị Trường (Market Benchmark Wage):**
  - Mức lương trung bình khu công nghiệp: $W_{\text{market}} = 8.500.000\text{ VNĐ/tháng}$.
  - Nếu người chơi trả lương $W_{\text{fulldy}} < W_{\text{market}}$:
    - Tốc độ tuyển người mới giảm $50\%$.
    - Tỷ lệ nhân viên cũ bỏ việc (Turnover Rate) tăng gấp 3 lần.
  - Nếu người chơi tăng lương $W_{\text{fulldy}} > W_{\text{market}} + 15\%$:
    - Hồ sơ ứng tuyển nộp dồn dập (+80%), giữ chân được các "Thợ Master".
    - Nhưng chi phí cố định (Fixed OPEX) phình to, ăn mòn lợi nhuận ròng!

### 2.2 Hiện Tượng "Làm Mấy Bữa Bỏ Ngang" (Ghosting & Sudden Quits)
Công việc kho vận có tính chất thể lực nặng nhọc (đi bộ nhặt hàng 15–20km/ca, bốc vác hàng cồng kềnh):
* **Chỉ số Sốc Thể Lực (Physical Shock Index):**
  - Trong 7 ngày đầu tiên đi làm, công nhân mới có **30% xác suất bỏ việc ngang không báo trước (No-show)** nếu ca làm việc bị ép làm quá tải.
* **Chỉ số Chán Nản (Boredom & Monotony Decay):**
  - Công việc lặp đi lặp lại khiến thanh Tinh thần (Morale) giảm $1.5\%/\text{ca}$.
  - Khi Morale $< 40\%$, nhân viên bắt đầu:
    - Đi lại chậm chạp, tụ tập buôn chuyện, "câu giờ" trong nhà vệ sinh $\to$ Năng suất tụt $40\%$.
    - Nộp đơn xin nghỉ hoặc đột ngột không đến kho.

### 2.3 Cơ Chế Giữ Chân & Phúc Lợi (Retention Amenities):
Người chơi có thể đầu tư các công trình phụ trợ để chống nhân viên bỏ việc:
* **Khu Nghỉ Giữa Ca Có Điều Hòa & Trà Đá Miễn Phí (Cooling Lounge):** Chi phí $15.000.000\text{ VNĐ}$ lắp đặt $\to$ Giảm $45\%$ tốc độ tụt Morale.
* **Bữa Ăn Ca Nóng Hổi & Tươi Ngon (Quality Meal Subsidy):** Chi phí $+30.000\text{ VNĐ/suất}$ $\to$ Hồi phục $20\%$ thể lực giữa ca, thợ gắn bó lâu dài.
* **Thưởng Chuyên Cần & Nhân Viên Xuất Sắc (Attendance Bonus):** Thưởng $+500.000\text{ VNĐ/tháng}$ cho thợ không nghỉ ngày nào $\to$ Triệt tiêu $80\%$ rủi ro nghỉ ngang đột ngột.

### 2.4 Cấp Bậc Kỹ Năng Của Thợ Chính (Skill Progression):
1. **Tập sự (Rookie - Ngày 1 đến 14):** Tốc độ 60 WPH, cần người kèm, hay hỏi.
2. **Thợ Tiêu Chuẩn (Skilled - Tháng 1 đến 6):** Tốc độ 100 WPH, quen sơ đồ kho.
3. **Thợ Lão Luyện (Veteran/Master - Trên 6 tháng):** Tốc độ 150 WPH, thuộc vị trí từng kệ hàng, phát hiện lỗi nhanh bằng mắt thường, có khả năng kèm cặp thợ mới.

---

## 3. CANH BẠC THUÊ LAO ĐỘNG THỜI VỤ MÙA SALE (CASUAL LABOR GAMBLE)

Vào các dịp Mega Sale (10.10, 11.11, 12.12), lượng đơn tăng gấp 5 lần, kho không thể nuôi sẵn quân số chính thức quanh năm mà bắt buộc phải **thuê ngoài (Temp Agency / Outsource Labor)**. Đây là con dao hai lưỡi:

```
                               ┌────────────────────────────────┐
                               │  ĐẶT THỜI VỤ TRƯỚC $T-7$ NGÀY  │
                               └───────────────┬────────────────┘
                                               │
                   ┌───────────────────────────┴───────────────────────────┐
                   │                                                       │
        ┌──────────▼──────────┐                                 ┌──────────▼──────────┐
        │  KỊCH BẢN A: THIẾU  │                                 │  KỊCH BẢN B: THỪA   │
        │    (Under-staffing) │                                 │   (Over-staffing)   │
        ├─────────────────────┤                                 ├─────────────────────┤
        │ - Đơn đổ về 50.000  │                                 │ - Đơn về có 18.000  │
        │ - Thuê 100 người    │                                 │ - Thuê 150 người    │
        │ - Đến thực tế: 65   │                                 │ - Đến đủ: 150       │
        │ ──► VỠ TRẬN SLA     │                                 │ ──► NGỒI CHƠI LỖ VỐN│
        └─────────────────────┘                                 └─────────────────────┘
```

### 3.1 Chọn Nhà Cung Cấp Lao Động (Labor Agency Tiers):
Trước đợt Sale, người chơi phải chọn Agency để ký hợp đồng cung ứng quân số:
* **Agency Giá Rẻ ("Cò Lao Động"):**
  - Chi phí: $220.000\text{ VNĐ/ca 8h}$.
  - Rủi ro bùng ca: **$25 - 40\%$** thợ đăng ký nhưng không đến bến xe đón.
  - Chất lượng: Lao động tự do, chưa từng làm kho, tỷ lệ dán nhầm tem cao ($3\%$).
* **Agency Tiêu Chuẩn (Fulldy Certified Partner):**
  - Chi phí: $320.000\text{ VNĐ/ca 8h}$.
  - Rủi ro bùng ca: **$10 - 15\%$**. Có giám sát viên đi cùng quản lý.
* **Agency Cao Cấp (Premium Contingent Pool):**
  - Chi phí: $450.000\text{ VNĐ/ca 8h}$.
  - Cam kết quân số $98\%$. Thợ đã được đào tạo quét barcode cơ bản.

### 3.2 Kịch Bản Ác Mộng 1: "Tuyển Không Đủ Người & Bùng Ca Giờ Chót"
* **Tình huống:** Kế hoạch cần 120 thợ thời vụ lúc 22:00 đêm sale. Nhưng đến 22:15, xe buýt Agency chỉ chở đến 78 người (bị bùng 42 người do họ bỏ sang kho đối thủ trả giá cao hơn 20k/giờ).
* **Hậu quả:** 50 bàn đóng gói chỉ sáng đèn 28 bàn. Hàng trăm giỏ nhặt hàng nằm tắc nghẽn ở bãi đệm. Đồng hồ đếm ngược SLA Shopee FHR kêu tít tít dồn dập.
* **Hành Động Khẩn Cấp (Emergency Action Cards):**
  - `GATE_WALK_IN_SURGE`: Cử nhân sự ra trước cổng khu công nghiệp phát loa tuyển lao động tự do với giá nóng tăng gấp 1.8 lần ($+500.000\text{ VNĐ/ca}$).
  - `MANDATORY_OVERTIME_CORE`: Ép toàn bộ thợ chính thức ca ngày ở lại làm thông ca (Double Shift). Chi phí lương OT gấp đôi và làm tụt $30\%$ thể lực.

### 3.3 Kịch Bản Ác Mộng 2: "Thừa Thãi Người Bất Ngờ Khi Đơn Không Về Đủ"
* **Tình huống:** Dự báo Sale của Merchant báo 60.000 đơn, quản lý kho cắn răng thuê 150 thợ thời vụ. Tuy nhiên, sàn TMĐT bị sập cổng thanh toán hoặc campaign bán ế, đơn về thực tế chỉ có 20.000 đơn!
* **Hậu quả:** 150 thợ thời vụ làm việc 3 tiếng là hết đơn để làm. Họ ngồi tụ tập trên sàn, hút thuốc ngoài cửa dock, nhưng hợp đồng quy định vẫn phải trả đủ lương trọn ca (Full Shift Pay) kèm tiền ăn, tiền xe đưa đón!
* **Hành Động Cắt Lỗ (Mitigation Action Cards):**
  - `EARLY_DISMISSAL_BUYOUT`: Đàm phán trả $60\%$ lương để cho thợ thời vụ ra về sớm, giải phóng mặt bằng và tiết kiệm điện.
  - `PIVOT_TO_CYCLE_COUNT`: Điều chuyển thợ thời vụ nhàn rỗi sang làm nhiệm vụ kiểm kê kho bãi (Inventory Auditing) và dọn dẹp phân loại pallet hỏng để vớt vát giá trị.

---

## 4. CƠ CHẾ KÈM CẶP: BUDDY SYSTEM (CÂN BẰNG TỐC ĐỘ VS SAI SÓT)

Thợ thời vụ không thuộc vị trí kho nên đi lại lóng ngóng, dễ nhặt nhầm size giày, nhầm màu son môi. Người chơi có thể kích hoạt cơ chế **Cặp Đôi Cùng Tiến (Buddy System)**:

```
[1 Thợ Chính Veteran (150 WPH)]  <── Ghép cặp ──>  [2 Thợ Thời Vụ (60 WPH/người)]
```

* **Ưu điểm:**
  - Tỷ lệ đóng gói sai sót của thợ thời vụ giảm từ $3.0\%$ xuống còn **$0.2\%$**.
  - Không bị khách hàng phạt tiền bẹp vỡ hàng hay giao nhầm SKU.
* **Đánh đổi (Trade-off):**
  - Thợ chính phải liên tục chỉ dẫn, kiểm tra tem hộ $\to$ Tốc độ nhặt hàng của thợ chính bị giảm $25\%$ (từ 150 WPH xuống 112 WPH).
  - Người chơi phải cân não: Chọn tốc độ tối đa để cứu SLA (chấp nhận rủi ro sai sót) hay chọn chất lượng an toàn (chấp nhận tốc độ chậm hơn).

---

## 5. CÔNG THỨC TOÁN HỌC TRONG SIMULATION CORE

### 5.1 Năng Suất Thực Tế Toàn Kho Theo Tỷ Lệ Nhân Sự:
$$WPH_{\text{total}} = \sum_{i \in \text{Core}} WPH_i \times f_{\text{fatigue}}(t) \times \frac{Morale_i}{100} + \sum_{j \in \text{Temp}} WPH_{\text{temp}} \times f_{\text{buddy}}(j)$$

Trong đó:
* $WPH_{\text{temp}}$ mặc định chỉ bằng $50\% - 65\%$ so với thợ chính.
* $f_{\text{buddy}} = 0.85$ nếu không có người kèm (nhặt chậm vì tìm kệ), nhưng $f_{\text{buddy}} = 1.15$ nếu có thợ chính dẫn đường.

### 5.2 Xác Suất Bỏ Việc Ngang Của Thợ Chính Trong Ca:
$$P(\text{Quit}) = P_0 \times \left(1 + 2.5 \times \max\left(0, \frac{W_{\text{market}} - W_{\text{fulldy}}}{W_{\text{market}}}\right)\right) \times \left(1 + 1.8 \times \mathbb{I}_{\text{Morale} < 30\%}\right)$$

### 5.3 Số Lượng Thợ Thời Vụ Thực Tế Đến Bến Xe (No-Show Stochastic Model):
$$N_{\text{actual}} = \text{Binomial}\left(N_{\text{booked}}, 1 - P_{\text{no\_show}}(\text{AgencyTier})\right)$$
* Agency Giá Rẻ: $P_{\text{no\_show}} \sim \mathcal{U}(0.25, 0.40)$.
* Agency Tiêu Chuẩn: $P_{\text{no\_show}} \sim \mathcal{U}(0.10, 0.15)$.
* Agency Cao Cấp: $P_{\text{no\_show}} \sim \mathcal{U}(0.02, 0.05)$.

---

## 6. GIAO DIỆN QUẢN LÝ NHÂN SỰ TRÊN MISSION CONTROL (HR DRAWER UI)

Khi mở tab **Quản Trị Nhân Sự (Workforce Management)**:
1. **Bảng Quân Số Hiện Diện:** 142/150 Thợ Chính (8 thợ vắng không phép), 65/100 Thợ Thời Vụ (Bị bùng 35 người!).
2. **Biểu Đồ Căng Thẳng & Tinh Thần:** Cảnh báo 12 thợ Zone B đang có nguy cơ bỏ việc vì quá tải liên tục 3 tiếng.
3. **Thanh Điều Chỉnh Lương Thị Trường:** Thanh trượt tăng/giảm lương thưởng phụ cấp trực tiếp để xem tác động ngay lập tức lên tốc độ tuyển người.
4. **Bảng Đặt Hàng Agency Mùa Sale:** Lựa chọn Agency, đặt cọc trước tiền quân số, xem tỷ lệ rủi ro bùng ca.

---

© 2026 Fulldy Games Platform. All rights reserved.
Tài liệu Quản trị Nhân sự & Lao động Kho vận Fulldy Center.
