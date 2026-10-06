# Genspark Deep Research Session 1: Game Mechanics & Dynamic Bottlenecks
* **AI Model:** gpt-5.4
* **Thời gian thực hiện:** 2026-10-06 20:14:41
* **Thời gian phản hồi:** 240.6s

---

Tuyệt. Mình sẽ tiếp cận như đang viết **design foundation cho Boxme Mission Control 2.0**: không chỉ “game hay”, mà là **game mô phỏng vận hành kho e-commerce có độ căng chiến thuật thật**, nơi người chơi liên tục phải chữa cháy, tối ưu luồng, và sống chung với SLA.

---

# BOXME MISSION CONTROL 2.0  
## Deep Research: Core Loop, Dynamic Bottleneck Engine, Resource Economy, Wave Pacing

## 0. Luận điểm thiết kế cốt lõi

**Fantasy của game** không phải “xây kho đẹp” mà là:

> “Tôi là người điều hành một mạng lưới fulfillment đang sống, luôn méo mó, luôn lệch tải, luôn có SLA dí sau lưng — và tôi phải giữ cho cả hệ thống không vỡ.”

Điểm khác biệt của Boxme Mission Control 2.0 so với city-builder/tycoon thông thường:

- Không phải bài toán **tăng trưởng tuyến tính**.
- Không phải bài toán **layout là xong**.
- Mà là bài toán **dòng chảy + đồng bộ + deadline + biến động**.

Đặc biệt, luồng của bạn có một “DNA gameplay” rất mạnh:

**Inbound -> Picking (Zones A-E) -> Item Sorting Buffer -> Pack Banks (P01-P50) -> Handover -> Docks (D1-D6)**

Đây không phải dây chuyền thẳng kiểu factory đơn giản, mà là:
- có **song song** ở các zone pick,
- có **điểm gom đồng bộ** ở IS Buffer,
- có **nút phân phối song song quy mô lớn** ở 50 pack banks,
- có **nút xuất bến hữu hạn** ở handover và dock,
- và trên đầu là **SLA marketplace** tạo áp lực thời gian không đồng đều.

Nói ngắn gọn:  
**Game này nên là “Constraint-Surfing Simulator”** — người chơi không giải quyết bottleneck một lần, mà **cưỡi trên bottleneck khi nó di chuyển khắp mạng lưới**.

---

# 1. CORE GAME LOOP

---

## 1.1. Kiến trúc vòng lặp hành vi chuẩn cho game này

Bạn đã gợi ý khung rất đúng:

> **Sense -> Triage -> Intervene -> Flow Feedback -> Debrief**

Đây nên là “xương sống” của mọi tầng gameplay.

### A. Sense
Người chơi đọc hệ thống qua:
- queue lengths
- heatmap tắc nghẽn
- SLA risk overlay
- worker fatigue/morale
- buffer occupancy
- dock ETD/dispatch readiness
- dự báo áp lực 5-15 phút tới

**Mục tiêu cảm xúc**:  
“Có quá nhiều thứ đang xảy ra, nhưng mình hiểu được vấn đề đang hình thành ở đâu.”

### B. Triage
Người chơi phải quyết định:
- cứu trạm nào trước?
- cứu theo tiêu chí gì?
  - cứu SLA?
  - cứu throughput?
  - cứu chi phí?
  - cứu chất lượng?
  - cứu tinh thần đội ngũ?
- chấp nhận để metric nào xấu đi?

**Triage là nơi game trở nên sâu.**  
Nếu mọi vấn đề đều xử lý được “đúng” thì game sẽ phẳng. Triage phải là nghệ thuật **hy sinh có tính toán**.

### C. Intervene
Người chơi tung can thiệp:
- chuyển nhân lực
- mở OT
- ưu tiên wave
- đóng/giảm inflow từ upstream
- nới rule gom đơn
- tạm tắt QC phụ
- đổi bổ sung vật tư pack
- đổi dock sequencing
- giữ xe / gọi xe bổ sung
- kích hoạt emergency policy

### D. Flow Feedback
Can thiệp phải tạo kết quả **nhanh, rõ, nhưng không hoàn toàn sạch**:
- cứu Pick -> IS Buffer phình
- cứu IS Buffer -> Pack nghẽn
- cứu Pack -> Handover tràn
- ép Handover -> Dock quá tải
- đẩy OT -> fatigue tăng -> lỗi tăng ở 30 phút sau

**Phản hồi phải nhìn thấy được** trong 10–90 giây gameplay, không quá chậm.

### E. Debrief
Cuối ca/giữa ca:
- SLA achieved vs missed
- nơi bottleneck đã di chuyển
- chi phí OPEX
- OT burn
- tỷ lệ lỗi / rework / damage
- worker health & morale debt
- “near misses” đáng học

Debrief tạo cảm giác:
> “Ca này mình sống sót, nhưng cái giá là gì?”

---

## 1.2. Bóc tách loop của các game mẫu

---

### Factorio
**Vòng lặp hành vi**
1. Thấy thiếu hụt / tắc dòng
2. Lần dấu nguyên nhân
3. Sửa cục bộ
4. Tăng sản lượng
5. Hệ quả mới phát sinh ở downstream/upstream
6. Quay lại tối ưu

**Điểm gây nghiện**
- Tính nhân quả cực rõ
- Sửa một chỗ thấy cả hệ thống phản hồi
- Tối ưu “chưa bao giờ xong”
- Người chơi luôn thấy một improvement kế tiếp

**Bài học áp dụng**
- Boxme không cần automation sâu như Factorio, nhưng cần **causality visibility** tương đương.
- Người chơi phải luôn thấy:  
  **“Nếu tôi tăng X, Y sẽ bị ảnh hưởng.”**

---

### Two Point Hospital
**Vòng lặp hành vi**
1. Quan sát triệu chứng
2. Chẩn đoán nguyên nhân
3. Tái bố trí staff/room/priority
4. Dập đám cháy ngắn hạn
5. Xây giải pháp dài hạn
6. Xuất hiện bệnh nhân/hệ quả mới

**Điểm gây nghiện**
- Vấn đề mang khuôn mặt cụ thể
- Hỗn loạn nhưng đọc được
- Căng thẳng đi kèm hài hước/nhẹ nhàng
- Luôn có “việc nên làm ngay”

**Bài học áp dụng**
- Boxme nên biến đơn hàng/SLA thành các “ca bệnh”.
- Không chỉ thấy queue, mà thấy:
  - “85 đơn TikTok có nguy cơ trễ”
  - “12 đơn multi-item bị thiếu item zone E”
  - “Dock D3 chờ 1 chuyến xe, toàn bộ line xuất đang nghẽn”

---

### Mini Motorways
**Vòng lặp hành vi**
1. Quan sát dòng chảy
2. Nhìn nút giao sắp quá tải
3. Vẽ lại kết nối
4. Dòng được giải phóng tạm thời
5. Thành phố lớn lên
6. Tắc nghẽn quay lại ở quy mô cao hơn

**Điểm gây nghiện**
- Một thay đổi rất nhỏ có tác động lớn
- Stress tăng từ từ rồi đột ngột
- Người chơi luôn ở sát ngưỡng “sắp mất kiểm soát”

**Bài học áp dụng**
- Boxme cần **near-collapse feeling**.
- Trạng thái vui nhất không phải “ổn định tuyệt đối”, mà là:
  > “Mọi thứ đang vừa đủ chạy, nhưng chỉ cần thêm 1 cú spike là vỡ.”

---

## 1.3. “The Compulsion Loop” – điều gì khiến người chơi không dừng lại?

Đây là phần quan trọng nhất.

### Một compulsion loop mạnh thường có 6 yếu tố:

#### 1. Vấn đề luôn hữu hình
Người chơi phải **thấy** queue dâng, worker chạy mệt, dock đỏ, SLA nhấp nháy.  
Không thấy được vấn đề = không có thôi thúc hành động.

#### 2. Vấn đề có vẻ giải được
Nếu hệ thống quá mơ hồ, người chơi bỏ cuộc.  
Nếu quá dễ, người chơi chán.

Điểm ngọt là:
> “Mình nghĩ chỉ cần sửa thêm 1 thứ nữa là ổn.”

#### 3. Fix ngắn hạn luôn tạo biến chứng mới
Đây là nguồn gây nghiện lớn nhất trong game vận hành.

- Cứu cái này làm đau cái kia
- Không có nghiệm hoàn hảo
- Chỉ có quản trị hậu quả

#### 4. Feedback ngắn
Khoảng thời gian từ quyết định -> kết quả nên ngắn:
- 5–15 giây: hiệu ứng trực quan
- 30–90 giây: hệ quả hệ thống
- 3–5 phút: hậu quả chiến thuật đầy đủ

#### 5. Áp lực tích lũy có deadline
SLA là vàng.  
Deadline làm mọi quyết định có giá trị. Không deadline, tối ưu chỉ là bài toán khô.

#### 6. Luôn có “suýt nữa”
Người chơi bị giữ lại bởi cảm giác:
- “Suýt cứu kịp”
- “Suýt vỡ dock”
- “Suýt perfect shift”

Near-miss mạnh hơn success sạch sẽ.

---

## 1.4. Loop đa tầng nên dùng

Game này nên có **3 tầng loop**:

### A. Micro Loop (5–30 giây)
- click xem trạm nóng
- kéo staff
- bật priority
- dập một queue

### B. Shift Loop (5–15 phút)
- sống qua 1 ca
- cân giữa throughput / SLA / chi phí / con người
- đối mặt 2–4 wave + 1 boss event

### C. Meta Loop (30–120 phút)
- mở công cụ điều độ mới
- nâng cấp scanner/buffer/conveyor/software
- huấn luyện đa kỹ năng
- mở chính sách marketplace chuyên biệt
- cải thiện layout / staffing doctrine

**Nếu chỉ có micro loop**, game thành firefighting clicker.  
**Nếu chỉ có meta loop**, game mất cảm giác “mission control”.  
Phải có cả ba.

---

# 2. DYNAMIC BOTTLENECK ENGINE  
## Áp dụng Theory of Constraints của Goldratt vào game

---

## 2.1. Nguyên lý thiết kế

Trong Boxme, bottleneck **không được đứng yên**.

Nếu bottleneck đứng yên:
- người chơi tìm ra đáp án tối ưu,
- build order trở nên solved,
- game chết sớm.

Ta cần một engine để bottleneck:
1. hình thành tự nhiên,
2. dịch chuyển hợp lý,
3. phát sinh từ chính hành động người chơi,
4. có thể dự báo nhưng không thể triệt tiêu hoàn toàn.

---

## 2.2. Mô hình node trong mạng vận hành

Xem mỗi trạm là một node:

- Inbound
- Pick A
- Pick B
- Pick C
- Pick D
- Pick E
- IS Buffer
- Pack P01–P50
- Handover
- Docks D1–D6

Mỗi node \(i\) có các biến:

- \(Q_i(t)\): queue / WIP hiện tại
- \(K_i\): capacity tối đa
- \( \lambda_i(t) \): arrival rate
- \( \mu_i(t) \): service rate hiệu dụng
- \(U_i(t)\): urgency pressure từ SLA
- \(F_i(t)\): fatigue level của workforce
- \(E_i(t)\): error/rework rate
- \(B_i(t)\): blocking pressure từ downstream
- \(S_i(t)\): starving pressure do upstream thiếu hàng
- \(V_i(t)\): variability/noise (độ biến động mix đơn, ETA xe, chất lượng inbound...)

### Service rate hiệu dụng
Ta không dùng \( \mu_i \) cố định, mà:

\[
\mu_i(t)=\mu_{base,i}\times L_i(t)\times M_i(t)\times Sys_i(t)\times Fat_i(t)\times Mix_i(t)
\]

Trong đó:
- \(L_i\): hiệu ứng nhân lực đang bố trí
- \(M_i\): morale modifier
- \(Sys_i\): uptime hệ thống/thiết bị
- \(Fat_i\): fatigue penalty
- \(Mix_i\): độ khó của mix đơn hàng

Ví dụ:
- multi-item order nhiều zone làm \(Mix\) xấu hơn
- đơn cồng kềnh làm pack chậm
- label printer lỗi làm handover chậm

---

## 2.3. Utilization chưa đủ, cần “Pressure Score”

Bottleneck động không chỉ là nơi có utilization cao nhất.

Ta cần **Pressure Score**:

\[
P_i(t)=
\alpha \cdot \frac{Q_i}{K_i}
+\beta \cdot \frac{\lambda_i}{\mu_i+\epsilon}
+\gamma \cdot U_i
+\delta \cdot B_i
+\eta \cdot V_i
+\theta \cdot F_i
-\kappa \cdot Slack_i
\]

Ý nghĩa:
- queue đầy -> áp lực tăng
- inflow > outflow -> áp lực tăng
- SLA đơn hàng cấp bách -> áp lực tăng
- downstream đầy khiến node bị block -> áp lực tăng
- mix biến động -> áp lực tăng
- nhân sự mệt -> áp lực tăng
- còn slack dự phòng -> áp lực giảm

### Bottleneck hiện tại
\[
Bottle(t)=\arg\max_i P_i(t)
\]

### Bottleneck dự báo
Để game chiến thuật hơn, hiển thị cả áp lực tương lai 3–5 phút:

\[
P_i^{future}(t+\Delta)=P_i(t)+\int_t^{t+\Delta}(\lambda_i(\tau)-\mu_i(\tau))d\tau + Shock_i
\]

Người chơi giỏi không chỉ dập bottleneck hiện tại, mà dập **bottleneck kế tiếp**.

---

## 2.4. Quy tắc di chuyển bottleneck

Bottleneck di chuyển theo ba quy luật:

### Quy luật 1: Release Amplification
Cứu upstream sẽ tăng áp lực downstream.

Ví dụ:
- tăng sản lượng Pick -> IS Buffer đầy nhanh hơn
- tăng IS throughput -> Pack Banks quá tải
- tăng pack output -> Handover/Dock nghẽn

### Quy luật 2: Synchronization Penalty
Đặc thù e-commerce multi-item là **đồng bộ**.

Một order cần item từ nhiều zone A-E.  
Nếu một zone chậm, các item khác tới sớm vẫn phải chờ ở IS Buffer.

Tạo biến số cực quan trọng:

### Order Synchronization Delay
Với order \(o\) cần các zone \(Z_o\), thời điểm item từ mỗi zone tới buffer là \(a_{o,z}\)

\[
SyncDelay_o = \max_{z \in Z_o}(a_{o,z}) - \min_{z \in Z_o}(a_{o,z})
\]

Trung bình của \(SyncDelay\) trên các order đang mở sẽ làm IS Buffer nghẽn dù throughput pick tổng vẫn cao.

### IS Buffer dwell time
\[
Dwell_{IS} = Dwell_{base} + \phi \cdot AvgSyncDelay + \psi \cdot IncompleteOrderRatio
\]

Đây là “chất riêng” của game kho fulfillment.  
Không phải cứ pick nhanh là tốt. Pick **lệch pha** có thể làm buffer chết.

### Quy luật 3: Finite Exit Constraint
Cuối mạng lưới là Handover và Dock, có sức chứa cứng:
- số line xe
- số dock doors
- giờ xe đến
- thời gian load
- dispatch cutoff

Nghĩa là mọi boost upstream cuối cùng đều va vào **cửa ra hữu hạn**.

---

## 2.5. Cascading Failure – công thức tích tụ và sụp đổ dây chuyền

Ta cần 3 trạng thái cho mỗi node:

1. **Healthy**
2. **Strained**
3. **Critical**
4. (tuỳ chọn) **Collapsed**

### Stress Ratio
\[
R_i=\frac{\lambda_i}{\mu_i}
\]

Nhưng collapse không chỉ do \(R_i > 1\), mà do thời gian tích lũy.

### Accumulated Stress
\[
A_i(t+\Delta t)=\max\left(0, A_i(t)+ (R_i-1)\Delta t + \chi \frac{Q_i}{K_i}\Delta t + \omega U_i\Delta t - Recovery_i\Delta t \right)
\]

- Khi \(R_i>1\), stress tích
- queue cao làm stress tích nhanh hơn
- SLA urgency làm stress nặng hơn
- recovery đến từ slack, nghỉ ca, hỗ trợ nhân lực, giảm inflow

### State thresholds
- \(A_i < T_1\): Healthy
- \(T_1 \le A_i < T_2\): Strained
- \(T_2 \le A_i < T_3\): Critical
- \(A_i \ge T_3\): Collapse

### Hiệu ứng theo state
**Strained**
- service rate -10%
- error +5%
- morale drain tăng

**Critical**
- service rate -25%
- error +15%
- block/starve lan mạnh
- visual/audio warning rõ

**Collapsed**
- tạm dừng xử lý
- rework dội ngược
- SLA debt bùng nổ
- phải dùng action mạnh mới cứu được

---

## 2.6. Lan truyền dây chuyền

Một node bị critical/collapsed gây 4 loại sóng lan:

### A. Backlog Wave
Queue dồn vào chính nó.

### B. Blocking Wave ngược upstream
Nếu downstream đầy, upstream bị chặn:
\[
B_i = f\left(\frac{Q_{down}}{K_{down}}\right)
\]

Ví dụ:
- Pack đầy -> IS không xả được
- IS đầy -> pick không có chỗ nhả tote
- pick bị giữ hàng -> inbound release phải hãm

### C. Starving Wave xuôi downstream
Nếu upstream tắc, downstream đói hàng:
- một số bàn pack trống cục bộ
- worker rảnh nhưng SLA toàn cục vẫn xấu

Điều này rất hay về gameplay:  
**người chơi thấy “vừa tắc vừa đói hàng” cùng lúc** ở các vùng khác nhau.

### D. Quality Wave
Khi stress cao:
\[
E_i = E_{base} + aF_i^2 + bOT_i + cRush_i + dDensity_i
\]

Lỗi tăng tạo:
- rework
- mis-sort
- mis-pack
- relabel
- damage
- complaint risk

Rework là **backflow**, cực quan trọng trong game mô phỏng vận hành.  
Nó làm hệ thống như bị “nhiễm độc”: công suất danh nghĩa còn đó nhưng bị ăn mòn bởi việc làm lại.

---

## 2.7. Nên dùng “soft constraint” hay “hard cap”?

Phải dùng cả hai.

### Hard cap
- sức chứa buffer hữu hạn
- số dock cố định
- số pack banks mở được
- max OT
- số supervisor interventions / AP

### Soft constraint
- fatigue
- morale
- quality drift
- pick-path inefficiency
- synchronization mismatch
- truck arrival uncertainty

Hard cap tạo luật rõ.  
Soft constraint tạo drama và tính người.

---

## 2.8. Mô hình riêng cho mạng fulfillment của bạn

Đây là chỗ đáng đầu tư nhất.

## Nút đặc biệt 1: Picking Zones A-E
Mỗi zone có:
- SKU density
- travel complexity
- picker skill fit
- batch compatibility
- congestion penalty

\[
\mu_{pick,z} = base_z \times staff_z \times routeEff_z \times stamina_z \times batchFit_z
\]

Nếu một zone có nhiều đơn multi-item “hot”, nó có thể trở thành choke point của toàn hệ thống dù volume không cao.

---

## Nút đặc biệt 2: Item Sorting Buffer
Đây không chỉ là queue, mà là **synchronization engine**.

Các biến:
- slot capacity
- tote occupancy
- incomplete order ratio
- aging partials
- sort accuracy
- priority class contamination

Nên có 2 kiểu nghẽn:
1. **Physical Full**: hết chỗ
2. **Logical Jam**: còn chỗ nhưng quá nhiều order dở dang, khó tìm match, hiệu suất sort giảm

\[
\mu_{IS} = \mu_{base} \times labor \times scanUptime \times (1 - JamFactor)
\]

\[
JamFactor = c_1 \cdot IncompleteRatio + c_2 \cdot AvgSyncDelay + c_3 \cdot PriorityMixEntropy
\]

---

## Nút đặc biệt 3: Pack Banks P01–P50
50 pack banks tạo cơ hội gameplay rất hay:
- mở/đóng bank theo wave
- bank chuyên SKU/marketplace/order type
- bank mệt vì thiếu vật tư
- bank nhanh nhưng lỗi cao
- bank chậm nhưng ổn định

Ta không nên cho 50 bank giống hệt nhau. Nên có:
- packer skill profile
- specialization bonus
- setup loss khi đổi loại đơn
- material dependency

\[
\mu_{pack,b} = base_b \times skill_b \times materialReady_b \times orderFit_b \times fatigue_b
\]

**Một sai lầm thiết kế cần tránh**: cho người chơi chỉ spam mở thêm bank là thắng.  
Phải có:
- AP giới hạn
- OPEX tăng mạnh
- material consumption
- supervisor span-of-control penalty
- quality decay khi mở quá nhiều bank nóng

---

## Nút đặc biệt 4: Handover + Docks D1-D6
Đây là “exit boss”.

Variables:
- staged parcels
- carrier readiness
- truck ETA variance
- dock loading rate
- dispatch cutoff windows
- dock assignment efficiency

\[
\mu_{dock,d}=loadRate_d \times truckReady_d \times labor_d \times paperwork_d
\]

Nếu xe chưa tới, công suất dock thực tế = 0 dù toàn kho hoạt động ngon.  
Rất phù hợp cho các tình huống boss event.

---

# 3. RESOURCE & ACTION ECONOMY  
## Kinh tế học tài nguyên và các đánh đổi đau đớn

---

## 3.1. Tài nguyên trong game phải “thiếu đúng cách”

Nếu người chơi có thể phản ứng mọi thứ mọi lúc, game mất chiều sâu.

Game này nên có ít nhất 5 loại tài nguyên:

---

## A. OPEX / Tiền mặt vận hành
Dùng cho:
- OT
- thuê thời vụ
- gọi xe bổ sung
- dùng pack premium materials
- sửa thiết bị nhanh
- mở line dự phòng

**Vai trò thiết kế**: tạo cái giá hữu hình cho cứu hỏa.

---

## B. Action Points (AP)
AP đại diện cho:
- năng lực điều phối của quản lý
- bandwidth của supervisor
- số can thiệp có thể thực hiện trong một khoảng thời gian

Ví dụ:
- mỗi 60 giây nhận 2 AP
- AP tối đa 8
- action lớn tốn 3–5 AP

**Tại sao cần AP?**
Vì trong game vận hành, vấn đề không chỉ là tiền — mà là **khả năng chú ý của bộ não điều độ**.

AP tạo cảm giác:
> “Tôi biết phải làm gì, nhưng không thể làm hết cùng lúc.”

Đây là thiết kế rất mạnh.

---

## C. Worker Fatigue / Morale
2 thanh riêng.

### Fatigue
- tăng theo thời gian làm việc, OT, rush mode
- giảm service rate
- tăng error/damage
- tăng nguy cơ micro-breakdown

### Morale
- phản ứng với fairness, workload, chaos, thành công/thất bại
- morale thấp làm:
  - nhận lệnh chậm hơn
  - hiệu quả cross-training kém
  - xác suất nghỉ/than phiền cao hơn
  - AP effectiveness giảm

**Fatigue = thể chất**
**Morale = tâm lý**

Không nên gộp một biến.

---

## D. Buffer Capacity
Không chỉ là số ô chứa, mà là “đất thở” của hệ thống.

Buffer là tài nguyên chiến lược vì:
- dùng để absorb volatility
- nhưng tích buffer quá mức làm che giấu vấn đề
- buffer đầy thì mọi lỗi bộc phát cùng lúc

Có thể biểu diễn thành:
- physical slots
- reserved urgent slots
- cold holding vs fast lane slots

---

## E. SLA Trust / Marketplace Reputation
Tài nguyên meta rất hay.

Mỗi sàn/marketplace có “niềm tin” vào kho:
- duy trì SLA tốt -> được buff về tolerance / volume quality / contract bonus
- SLA tệ -> bị penalty nặng hơn, demand mix xấu hơn, cutoff gắt hơn

Nó biến mỗi ca chơi thành một phần của chiến dịch dài hạn.

---

## 3.2. Hàm mục tiêu không nên chỉ là profit

Game sẽ hay hơn nếu người chơi luôn cân 4 trục:

\[
Score = w_1 Throughput + w_2 SLA + w_3 Quality + w_4 WorkerHealth - w_5 OPEX - w_6 Instability
\]

Trong đó:
- Throughput: số đơn hoàn tất
- SLA: đúng hạn / nguy cơ vi phạm
- Quality: damage/mis-pack/rework
- WorkerHealth: fatigue + morale
- OPEX: OT, temps, premium logistics
- Instability: số lần collapse / critical duration

Tùy mode mà trọng số khác nhau:
- Career mode: cân bằng dài hạn
- Daily challenge: ưu tiên SLA
- Hard mode: lợi nhuận mỏng, OPEX bị dí
- Event mode: sống qua cơn bão

---

## 3.3. Action Cards / Intervention Commands

Nên thiết kế như “operational powers”, không phải bài card theo nghĩa deckbuilder thuần.  
Người chơi có thể dùng từ panel command.

Mỗi action có:
- AP cost
- OPEX cost
- cooldown
- effect duration
- side effects
- impact vector lên SLA / Quality / Fatigue / Morale / Buffer

---

## Nhóm 1: Labor Flex Actions

### 1. Redeploy Pickers
Chuyển pickers từ zone dư sang zone nghẽn
- + cứu bottleneck cục bộ
- - zone khác đói hàng sau 1–2 phút
- - morale giảm nếu lạm dụng

### 2. Cross-Train Surge
Cho nhân viên hỗ trợ chéo Pack/IS
- mở năng lực tạm thời
- hiệu suất chỉ 70–85% staff chuẩn
- lỗi cao hơn nhẹ

### 3. Mandatory OT
- tăng công suất tức thì
- fatigue tăng mạnh
- morale giảm nếu chain OT liên tiếp

---

## Nhóm 2: Flow Control Actions

### 4. Throttle Inbound Release
Giảm đẩy hàng vào network
- giảm ngập downstream
- nhưng có thể tạo backlog ở đầu vào
- hợp khi network sắp choke ở IS/Pack

### 5. Priority Wave Release
Tung riêng wave đơn có SLA nguy cơ cao
- cứu FHR/FDR/LDR-like metrics
- làm mix toàn mạng méo
- đơn thường bị lùi, buffer entropy tăng

### 6. Hold-and-Consolidate
Giữ đơn partial chờ gom đủ thay vì xả lẻ
- giảm chaos pack
- tăng dwell ở buffer
- tốt cho quality, xấu cho urgency nếu dùng sai lúc

---

## Nhóm 3: Quality-Risk Actions

### 7. Skip Secondary Check
Bỏ bớt bước kiểm phụ
- throughput tăng
- mis-pack/damage tăng
- có xác suất tạo rework wave sau đó

### 8. Rush Pack Mode
- tăng tốc độ pack
- tiêu hao vật tư
- lỗi đóng gói tăng
- morale giảm

### 9. Fragile Handling Protocol
- chậm hơn
- lỗi damage giảm mạnh
- phù hợp wave hàng dễ vỡ / premium seller

---

## Nhóm 4: Infrastructure / Logistics Actions

### 10. Open Temporary Pack Lane
- mở thêm bank tạm
- tốn OPEX + AP cao
- cần vật tư + supervisor span
- hiệu quả giảm nếu floor quá đông

### 11. Expedite Materials Refill
- cứu pack starvation
- tốn tiền
- có thể kéo người khỏi khu khác

### 12. Call Backup Truck / Swap Dock
- cứu dispatch cutoff
- rất tốn tiền
- có cooldown dài
- dùng như “ultimate skill”

---

## Nhóm 5: Command & Visibility Actions

### 13. Focus Dashboard
- tốn 1 AP
- hiển thị bottleneck prediction tốt hơn 60s
- giảm uncertainty
- không cứu trực tiếp nhưng tăng chất lượng quyết định

### 14. Supervisor Push
- tăng response speed của 1 cluster
- AP cao
- morale giảm nếu spam

### 15. Freeze Non-Urgent Orders
- chặn một phần dòng bình thường
- cứu SLA cho urgent class
- tạo debt lớn cho giờ sau

---

## 3.4. Tough Trade-offs phải đau thật

Một vài trade-off mẫu:

### Cứu đơn vs Chi phí
- gọi OT / mở xe dự phòng / premium material
- cứu được chỉ số SLA
- nhưng phá margin cả ca

### Cứu tốc độ vs Chất lượng
- skip check, rush mode
- qua được cutoff
- nhưng rework và complaint ở ca sau

### Cứu node này vs giết node khác
- chuyển người sang IS
- pick hụt
- 10 phút sau pack đói hàng

### Cứu hôm nay vs phá ngày mai
- OT chain 2–3 ca
- hôm nay thắng
- ngày mai fatigue nền quá cao, game khó hơn

### Cứu đa số vs cứu đơn VIP
- tập trung rescue đơn marketplace trọng số cao
- hy sinh một đám đơn thường
- điểm ngắn hạn tốt, backlog dài hạn xấu

Nếu trade-off không đau, game không có kịch tính.

---

## 3.5. Nền kinh tế nên chống spam “giải pháp đúng”

Cần anti-dominant strategy:

- OT có diminishing returns
- mở nhiều pack banks gây supervisor overload
- cross-trained staff có fatigue nhanh hơn
- priority wave làm entropy tăng
- buffer expansion che bottleneck chứ không xoá bottleneck
- gọi thêm truck quá nhiều làm chi phí nhảy bậc

Ví dụ:
\[
OT\_gain_n = BaseGain \times (1 - d(n-1))
\]
với \(n\) là số block OT liên tiếp trong ngày.

---

# 4. WAVE PACING & BOSS EVENTS  
## Cơ chế kịch bản và sóng thử thách

---

## 4.1. Pacing của game này phải giống “ca trực”, không giống map skirmish phẳng

Người chơi cần cảm giác một ca làm có nhịp sinh học:

1. **Ramp-up**
2. **Stable flow**
3. **First spike**
4. **Partial recovery**
5. **Cross-pressure phase**
6. **Boss event**
7. **End-of-cutoff crunch**
8. **Debrief**

Game hay khi biết **siết – nhả – siết – nổ – cứu – thở**.

---

## 4.2. Cấu trúc tension & relief cho 1 ca 12–15 phút

Ví dụ:

### Pha 1 — Warm Start (0–2 phút)
- inbound vào đều
- tutorialized pressure
- người chơi setup staffing, mở bank hợp lý
- cho 1 bottleneck nhẹ để “khởi động mắt”

### Pha 2 — First Imbalance (2–5 phút)
- một zone pick lệch
- buffer partials tăng
- người chơi học bài “đồng bộ quan trọng hơn tổng throughput”

### Pha 3 — Managed Recovery (5–7 phút)
- nếu xử lý tốt, hệ thống tạm ổn
- cho phần thưởng dopamine: queue hạ, màu xanh trở lại

### Pha 4 — Hidden Debt Reveals (7–10 phút)
- fatigue bắt đầu cắn
- vật tư pack hụt
- dock ETA lệch
- decision trước đó quay lại đòi nợ

### Pha 5 — Boss Event (10–12 phút)
- cú sốc lớn, nhiều lớp
- đòi hỏi phối hợp nhiều công cụ
- không thể giải bằng một click

### Pha 6 — Final Cutoff Sprint (12–15 phút)
- tập trung cứu các đơn còn kịp
- triage cực mạnh
- nhiều quyết định “hy sinh có kiểm soát”

---

## 4.3. Boss Event trong game vận hành là gì?

Boss event không phải con quái.  
Boss event là **tổ hợp constraint đè chồng lên nhau**, khiến tri thức hệ thống của người chơi bị test.

Một boss tốt phải:
- có báo hiệu sớm
- có nhiều lớp nguyên nhân
- có ít nhất 2 cách xử lý
- buộc đánh đổi
- để lại hậu quả sau khi thắng

---

## 4.4. Catalogue Boss Events đề xuất

---

### Boss 1: Flash Sale Surge
**Biểu hiện**
- demand spike đột ngột
- mix đơn nghiêng mạnh vào 2 zone
- SLA priority cao

**Test người chơi**
- wave release
- labor flex
- chọn cứu SLA nào
- tránh làm IS buffer nghẽn vì lệch pha

**Twist**
- surge không đều: zone A/E quá tải, B/C/D nhàn

---

### Boss 2: Missing ASN / Inbound Discrepancy
**Biểu hiện**
- inbound data sai / thiếu
- pickers đi tìm không ra hàng
- false starvation và search time tăng

**Test**
- có dừng inflow để làm sạch?
- có tách khu kiểm tra?
- chấp nhận giảm throughput ngắn hạn để tránh chaos dài hạn?

---

### Boss 3: Sort Buffer Jam
**Biểu hiện**
- buffer chưa đầy vật lý nhưng jam logic
- partial orders tăng
- scanner congestion
- nhầm tote tăng

**Test**
- người chơi có hiểu SyncDelay không?
- có hãm pick từ zone quá nhanh không?
- có gom theo completion logic không?

Đây nên là boss signature của game này.

---

### Boss 4: Pack Material Shortage
**Biểu hiện**
- thùng/carton/tape/label stock cạn cục bộ
- bank mở nhiều nhưng không phát huy

**Test**
- vật tư như resource thật, không chỉ mỹ thuật
- có mở bank tạm ít hơn nhưng ổn định hơn không?

---

### Boss 5: Carrier Delay / Dock Closure
**Biểu hiện**
- xe tới trễ, một dock bị khóa
- handover tích tụ
- cutoff dí sát

**Test**
- reassign dock
- hold/resequence handover
- gọi backup truck hay chấp nhận miss một phần?

Boss này rất “đời”.

---

### Boss 6: WMS/Printer Latency Incident
**Biểu hiện**
- label in chậm
- scan chậm
- mọi node có cảm giác “chạy mà không đi”

**Test**
- player phải chuyển sang mode bảo toàn ổn định
- giảm inflow có kiểm soát
- giữ network không collapse chờ hồi phục

---

### Boss 7: Quality Recall Wave
**Biểu hiện**
- một batch sản phẩm cần kiểm tra thêm
- pack/handover phải re-open một số đơn

**Test**
- chịu throughput drop để bảo toàn quality?
- hay rush tiếp rồi ăn complaint/rework sau?

---

### Boss 8: Labor Shock
**Biểu hiện**
- thiếu người đột xuất / morale tụt / break kéo dài
- cluster productivity giảm dây chuyền

**Test**
- staff redundancy
- cross-skill investment từ meta có đáng tiền hay không

---

## 4.5. Boss event cần telegraph thế nào?

Một boss công bằng cần có 3 lớp tín hiệu:

### Lớp 1: Dự báo mềm
- demand trend chart
- ETA variance
- morale warning
- material low-stock

### Lớp 2: Dấu hiệu tiền khủng hoảng
- queue bắt đầu méo
- 1 node chuyển vàng
- synchronization gap tăng

### Lớp 3: Trigger rõ ràng
- thông báo sự kiện
- cutoff countdown
- dock D4 unavailable

Người chơi thua vì **xử lý kém**, không phải vì game “đánh úp vô lý”.

---

# 5. ĐẶC THÙ GAMEPLAY CỦA E-COMMERCE FULFILLMENT  
## Những cơ chế nên nhấn mạnh để game có bản sắc riêng

Đây là phần mình nghĩ rất quan trọng để Boxme không bị thành “Factorio kho hàng”.

---

## 5.1. Multi-item order là nguồn drama số 1
Đơn nhiều món qua nhiều zone tạo:
- pick không đồng tốc
- buffer dwell tăng
- SLA risk bị che giấu
- partials chiếm chỗ
- pack starvation cục bộ

=> Hãy xem **độ bất đồng bộ đơn hàng** là cơ chế lõi, không phải chi tiết phụ.

---

## 5.2. SLA không nên chỉ là đồng hồ đếm ngược
Mỗi marketplace nên có “personality”.

Ví dụ về mặt thiết kế:
- một nền tảng thưởng mạnh cho xử lý sớm đầu ngày
- một nền tảng phạt nặng late handover
- một nền tảng tolerance thấp với damage/mis-pack
- một nền tảng yêu cầu dispatch cutoff cứng

Nghĩa là:
- cùng một backlog,
- nhưng quyết định tối ưu sẽ khác theo mix marketplace.

---

## 5.3. “Operational Truth” phải mạnh hơn “build order”
Game phải để người chơi thắng bằng:
- quan sát tốt
- can thiệp đúng lúc
- hiểu hệ thống

không chỉ bằng:
- nâng cấp đúng cây skill
- mở thêm bàn pack
- tối ưu một layout tĩnh

---

## 5.4. Hệ thống phải “giải thích được”
Một game vận hành thất bại khi người chơi thua mà không hiểu vì sao.

Cần có postmortem:
- bottleneck timeline
- stress heatmap replay
- missed SLA causes
- which intervention caused downstream overload
- hidden debt summary

Ví dụ:
> “Bạn cứu Zone C lúc 09:42, làm IS occupancy tăng từ 71% lên 96% trong 90 giây; 14 đơn urgent bị kẹt vì thiếu item Zone E; Pack banks 22–31 starved trong khi 1–10 overflow.”

Đây là vàng.

---

# 6. ĐỀ XUẤT HỆ THỐNG KPI & UI ĐỂ CORE LOOP CHẠY ĐƯỢC

---

## 6.1. KPI hiển thị chính

Người chơi không nên bị drown bởi quá nhiều số.  
Chỉ cần 5 “north-star panels”:

1. **SLA Risk**
   - % đơn an toàn / có nguy cơ / sắp trễ

2. **Flow Health**
   - bottleneck hiện tại
   - bottleneck dự báo kế tiếp

3. **Buffer Health**
   - IS occupancy
   - incomplete ratio
   - average sync delay

4. **People Health**
   - fatigue
   - morale
   - OT burn

5. **Dispatch Readiness**
   - parcels ready for handover
   - truck ETA / dock occupancy
   - cutoff countdown

---

## 6.2. Overlays cho 3D isometric
Vì game 3D isometric, readability rất quan trọng. Nên có overlay bật/tắt:

- Heatmap tắc nghẽn
- SLA urgency glow
- Worker fatigue tint
- Buffer occupancy
- Route congestion
- Dock readiness

Và một tính năng cực hữu ích:
### “Flow Trace”
Click vào một order class hoặc station, game highlight đường đi và điểm nghẽn của nó.

---

# 7. KHUNG CÔNG THỨC THỰC DỤNG ĐỂ PROTOTYPE

Nếu cần prototype nhanh, mình khuyên bắt đầu với bộ công thức đơn giản nhưng expressive:

---

## 7.1. Node throughput
\[
Out_i = \min(Q_i, \mu_i)
\]

\[
Q_i(t+1)=Q_i(t)+In_i-Out_i+Rework_i
\]

---

## 7.2. Effective service rate
\[
\mu_i = \mu_{base,i}\cdot StaffMod_i \cdot SkillMod_i \cdot SystemMod_i \cdot (1-FatiguePenalty_i)\cdot (1-JamPenalty_i)
\]

---

## 7.3. Pressure score
\[
P_i=0.30\frac{Q_i}{K_i}+0.25\frac{\lambda_i}{\mu_i+\epsilon}+0.20U_i+0.15B_i+0.10F_i
\]

---

## 7.4. SLA urgency
Với order \(o\):

\[
Urgency_o = \exp\left(-\frac{TimeToBreach_o}{h}\right)
\]

Tổng theo node:
\[
U_i=\frac{\sum_{o \in node_i} Urgency_o \cdot Weight_{marketplace,o}}{N_i+\epsilon}
\]

---

## 7.5. Sync delay for multi-item
\[
SyncDelay_o = \max(a_{o,z}) - \min(a_{o,z})
\]

\[
JamPenalty_{IS}=k_1\cdot AvgSyncDelay + k_2\cdot IncompleteRatio
\]

---

## 7.6. Fatigue
\[
Fatigue_i(t+1)=Fatigue_i(t)+Workload_i\cdot c_1 + OT_i\cdot c_2 - Rest_i\cdot c_3
\]

---

## 7.7. Error rate
\[
Error_i = e_0 + a\cdot Fatigue_i^2 + b\cdot RushMode_i + c\cdot Density_i
\]

---

## 7.8. Collapse threshold
\[
A_i(t+1)=\max(0, A_i(t)+ (P_i-1)\cdot \Delta t - Recovery_i)
\]

Nếu \(A_i > T_2\): Critical  
Nếu \(A_i > T_3\): Collapse

---

# 8. KẾT LUẬN THIẾT KẾ

## Tinh thần đúng của Boxme Mission Control 2.0 là:

- **Không phải game xây kho**, mà là game **điều hành dòng chảy sống**.
- **Không phải tối ưu một lần**, mà là **liên tục tái tối ưu trước bottleneck đang di chuyển**.
- **Không phải chỉ tăng throughput**, mà là **cân bằng throughput – SLA – chất lượng – con người – chi phí**.
- **Không phải chỉ phản xạ nhanh**, mà là **đọc hệ thống và hiểu hậu quả cấp hai**.

Nếu làm đúng, compulsion loop của game sẽ là:

> “Mình vừa cứu được Pick… ôi chết buffer kẹt rồi…  
> OK, cứu buffer… chết, pack tràn…  
> Cứu pack… dock sắp miss cutoff…  
> Chỉ cần cứu thêm đợt này nữa thôi…”

Đó chính là loop khiến người chơi không rời mắt.

---

Nếu bạn muốn, ở bước tiếp theo mình có thể làm tiếp 1 trong 3 thứ sau:

1. **Thiết kế Game Design Document chi tiết cho Boxme Mission Control 2.0**  
   - core systems
   - UI
   - progression
   - win/lose
   - scenario mode

2. **Thiết kế bảng Action Cards hoàn chỉnh 30–50 lệnh can thiệp**  
   - cost
   - cooldown
   - side effects
   - rarity
   - upgrade path

3. **Thiết kế mô hình số liệu/simulation sheet**  
   - công thức cân bằng
   - biến trạng thái
   - tuning framework cho prototype

Nếu muốn, mình có thể làm luôn **bản “v1 playable prototype spec”** cho team design + product + dev.
