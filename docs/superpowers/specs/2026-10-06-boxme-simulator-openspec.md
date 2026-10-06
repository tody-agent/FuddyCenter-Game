# OpenSpec: Boxme Mission Control & Operations Simulator 2.0
**Hệ thống Mô phỏng Vận hành Kho bãi 3D, Bản sao số (Digital Twin) & Sandbox Ra Quyết định Đa biến số**

* **Mã đặc tả:** OPENSPEC-SIM-2026-10-06
* **Trạng thái:** DRAFT / STAGED (Đang hoàn thiện ý tưởng & chờ các đợt nghiên cứu tiếp)
* **Phiên bản:** 2.0.0-dev
* **Ngày tạo:** 06/10/2026
* **Tác giả:** Antigravity Team & Boxme Architecture Group

---

## 1. TỔNG QUAN & TẦM NHÌN DỰ ÁN (Project Vision)

### 1.1 Bối cảnh
Dự án tiền nhiệm là một file HTML đơn khối (`boxme-mission-control.html`, dung lượng ~1.07MB) tích hợp cả Three.js, React, procedural assets và logic mô phỏng kho Boxme VSIP Bắc Ninh cho đợt 10.10 Mega Sale.

### 1.2 Tầm nhìn phiên bản 2.0
Chuyển hóa từ một bản demo tĩnh thành một **Hệ thống Mô phỏng Vận hành Kho bãi Toàn diện (Operations Simulation & Management Game / Digital Twin)** với các năng lực cốt lõi:
1. **Nạp dữ liệu thực tế linh hoạt:** Tiếp nhận dữ liệu cấu hình vận hành (đơn hàng, staffing, xe tải) từ WMS/OMS hoặc qua giao diện tham số hóa.
2. **Mô phỏng chính xác & trực quan hóa 3D đỉnh cao:** Render 3D isometric chuẩn PBR, ánh sáng tiếp xúc GTAO/N8AO, bloom cảnh báo, camera đa góc nhìn linh hoạt.
3. **Sandbox thử nghiệm quyết định (What-If Decision Making):** Cho phép người vận hành can thiệp (chuyển thợ, mở trạm phụ, ưu tiên sàn, điều xe), đánh giá tác động chi phí vs số đơn cứu được.
4. **Time-Travel (Cây nhánh quyết định DAG):** Khả năng tua ngược thời gian về trước sự cố, rẽ nhánh thử nghiệm Phương án A vs Phương án B để chọn giải pháp tối ưu nhất.
5. **Kỹ thuật Mô phỏng Monte Carlo:** Chạy ngầm 500–1.000 kịch bản ngẫu nhiên qua Web Worker để đưa ra phân phối rủi ro P50, P90, P95 giúp ra quyết định có cơ sở xác suất.
6. **Đa ngôn ngữ quốc tế hóa (i18n):** Hỗ trợ toàn diện 4 thị trường trọng điểm: **Tiếng Việt (VI), Tiếng Anh (EN), Tiếng Thái (TH), Tiếng Trung (ZH)**.

---

## 2. KIẾN TRÚC PHẦN MỀM TỔNG THỂ (System Architecture)

Hệ thống tuân thủ nguyên tắc **Tách rời triệt để (Strict Decoupling)** giữa Simulation Engine, Render Loop và UI Layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REACT 19 UI LAYER                               │
│  Header HUD ── Metric Ribbon ── Risk Inbox ── Inspector ── Timeline    │
│  Multi-Language (VI/EN/TH/ZH) ── Monte Carlo & Data Importer Modals    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Zustand Stores / Event Bus
┌───────────────────────────────────▼────────────────────────────────────┐
│                    DECISION & SANDBOX ENGINE                           │
│  Command Pattern ── State Snapshots (DAG Tree) ── Time-Travel Replay   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
┌───────────────────▼──────────────┐   ┌─────────────▼───────────────────┐
│     SIMULATION CORE (LOGIC)      │   │    THREE.JS RENDER PIPELINE     │
│  Fixed Timestep Clock (10-20Hz)  │   │  RAF Loop (60-120 FPS)          │
│  Deterministic Seeded PRNG       │   │  State Interpolation (lerp)     │
│  Multi-stage M/M/c Queue Math    │   │  PBR Materials & Dynamic Lights │
│  SLA Breach Predictor            │   │  N8AO + Selective UnrealBloom   │
│  Web Worker: Monte Carlo Engine  │   │  InstancedMesh (Boxes/Workers)  │
└──────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 3. LÕI TÍNH TOÁN LOGISTICS & DỮ LIỆU ĐẦU VÀO (Simulation Core)

### 3.1 Luồng Hàng Hóa Đa Chặng (Multi-Stage Logistics Flow)
Hệ thống mô phỏng dòng chuyển động vật lý của đơn hàng qua 6 chặng chính:
$$\text{Receiving / Inbound} \longrightarrow \text{Pick Zones (A–E)} \xrightarrow{\text{IS Buffer}} \text{Pack Banks (1–5)} \longrightarrow \text{Handover (A–D)} \longrightarrow \text{Docks (D1–D6)}$$

* **Pick Zones (A–E):** Khu vực nhặt hàng nhanh, kết nối trực tiếp với 4 dãy kệ High Bay (S1–S4) qua nhiệm vụ bổ sung hàng của Controller và xe nâng.
* **IS Buffer (Item Sorting / Chờ gom đơn):** Vùng đệm tích lũy đơn nhiều món (multi-item), điểm thắt cổ chai tiềm năng trước khi sang đóng gói.
* **Pack Banks (1–5):** Bàn đóng gói tiêu chuẩn (P01–P50) và trạm khẩn cấp (E1–E3).
* **Handover Zones (A, B, C, D, Other):** Khu vực phân loại và bàn giao cho từng hãng vận chuyển (SPX, GHN, J&T, Ninja Van, Viettel Post).
* **Dock Bays (D1–D6):** Cửa xuất xe tải tải trọng lớn với cửa cuốn tự động và cầu nâng dock leveler.

### 3.2 Hệ Số Phức Tạp Đơn Hàng & Năng Suất
Năng suất thực tế của nhân sự bị suy giảm theo độ phức tạp của giỏ hàng ($C_{\text{type}}$):

$$WPH_{\text{thực tế}} = \frac{WPH_{\text{định mức}}}{C_{\text{type}}}$$

| Loại đơn hàng | Tỷ trọng mặc định | Hệ số $C_{\text{pick}}$ | Hệ số $C_{\text{pack}}$ | Đặc điểm |
|---|---|---|---|---|
| **Single** | 42% | 1.0 | 1.0 | 1 món 1 đơn, tốc độ nhanh nhất |
| **Mix** | 22% | 1.7 | 1.6 | Nhiều SKU khác vị trí |
| **Combo** | 14% | 1.5 | 1.4 | Gói combo khuyến mãi |
| **Heavy** | 8% | 2.2 | 2.4 | Hàng cồng kềnh, cần 2 người hoặc xe nâng |
| **Pre-packed** | 6% | 0.6 | 0.5 | Hàng đóng sẵn bao bì, chỉ dán tem |
| **Liquid / Fragile** | 5% | 1.9 | 2.2 | Mỹ phẩm, chất lỏng cần bọc xốp chống sốc |
| **B2B Bulk** | 3% | 2.8 | 3.0 | Đơn sỉ nguyên thùng/pallet |

### 3.3 Dự Báo Vi Phạm SLA & Tính Bán Kính Tác Động (Blast Radius)
Hệ thống theo dõi 3 mốc cam kết SLA thời gian thực:
* **Shopee Fast Handover Rate (FHR):** Đơn trước 12:00 phải bàn giao trước 17:00.
* **TikTok Fast Dispatch Rate (FDR) & Late Dispatch Rate (LDR):** Chu kỳ gắt gao 6 giờ với đơn Same-Day.
* **Boxme Internal Deadline:** Mốc cam kết nội bộ nhanh hơn sàn 60 phút để tạo vùng đệm an toàn (safety buffer).

---

## 4. KỸ THUẬT MONTE CARLO & TIME-TRAVEL BRANCHING

### 4.1 Tính Tất Định (Determinism with Seeded PRNG)
* Thay thế toàn bộ `Math.random()` bằng **Mulberry32 PRNG** nhận seed (ví dụ: `10102026`).
* Đảm bảo tính khả lặp (reproducibility): Khi quay lại thời gian để thử nghiệm, các sự kiện môi trường độc lập xảy ra hoàn toàn giống nhau, giúp cô lập chính xác tác động của hành động quản lý.

### 4.2 Cây Nhánh Quyết Định (What-If DAG & Snapshots)
* **Snapshot siêu nhẹ:** Mỗi 15 phút ảo hoặc trước mỗi thao tác can thiệp, engine chụp 1 snapshot cấu trúc dữ liệu nhị phân / JSON gọn gàng:
  ```typescript
  interface WarehouseSnapshot {
    snapshotId: string;
    timestampMin: number;
    parentSnapshotId: string | null;
    actionApplied?: ManagerAction;
    zoneStates: Record<ZoneId, { queue: number; workers: number; health: ZoneHealth }>;
    activeOrdersSummary: { stageCounts: Record<Stage, number>; atRiskCount: number };
    fleetStates: { trucks: TruckStatus[]; forklifts: ForkliftStatus[] };
    kpis: KpiMetrics;
  }
  ```
* **Command Pattern:** Mọi can thiệp là một đối tượng `ManagerAction` có phương thức `execute()` và `undo()`:
  * `TransferWorkers(fromZone, toZone, count)`
  * `ActivateEmergencyStation(stationId: 'E1' | 'E2' | 'E3')`
  * `PrioritizePlatform(platform: 'tiktok' | 'shopee')`
  * `RequestCarrierTruckSurge(carrier: CarrierCode)`

### 4.3 Công Cụ Mô Phỏng Monte Carlo Chạy Song Song (Web Worker)
* **Vấn đề:** Chạy 1.000 lượt giả lập trên Main Thread sẽ làm đứng hình Three.js (0 FPS).
* **Giải pháp:** Gói Simulation Core thành module **Headless (Không phụ thuộc DOM/Three.js)** và đưa vào Web Worker.
* **Các biến phân phối ngẫu nhiên:**
  * Năng suất thợ: $WPH \sim \mathcal{N}(\mu, \sigma^2)$ kết hợp hàm mệt mỏi thể lực theo thời gian ca $f(t) = 1 - 0.03 \max(0, t - 4)$.
  * Độ trễ xe lấy hàng: $T_{\text{delay}} \sim \text{Lognormal}(\mu=15\text{m}, \sigma=0.6)$.
  * Đơn hàng đột biến: $Arrival \sim \text{Poisson}(\lambda(t))$.
* **Đầu ra thống kê:**
  * Biểu đồ phân vị rủi ro: $P_{10}$ (Tốt nhất), $P_{50}$ (Trung bình), $P_{90}$ (Tình huống rủi ro cao), $P_{99}$ (Khủng hoảng tồi tệ).
  * Chỉ số ROI: Chi phí phụ cấp/OT so sánh với giá trị đơn hàng cứu được và tiền phạt SLA tránh được.

---

## 5. PIPELINE ĐỒ HỌA 3D & NÂNG CẤP CHẤT LƯỢNG HÌNH ẢNH (Three.js PBR)

### 5.1 Kỹ Thuật Dựng Hình Hiệu Năng Cao (Draw Call Optimization)
* **`THREE.InstancedMesh`:**
  * 3.000 hộp carton với màu sắc đa dạng (Kraft, Shopee cam, TikTok đen) gói gọn trong **1 Draw Call**.
  * 200 nhân công với tư thế động theo vùng làm việc.
* **Static Geometry Merging:** Toàn bộ khung kệ High Bay, bàn ghế, hàng rào, vách kho được gộp bằng `BufferGeometryUtils.mergeGeometries()` kết hợp `vertexColors`.

### 5.2 Nâng Cấp Ánh Sáng & Post-Processing
* **N8AO (Ground Truth Ambient Occlusion):** Thư viện AO thế hệ mới cho Three.js WebGL, tạo bóng đổ tiếp xúc cực sắc nét dưới gầm pallet, chân kệ và bánh xe tải.
* **Selective UnrealBloomPass:** Ngưỡng lọc `threshold: 1.05`. Chỉ phát sáng đèn báo động xe nâng, còi xoay khẩn cấp và viền ô sàn đang ở mức `critical`.
* **ACESFilmic Tone Mapping:** Phục hồi chi tiết vùng quá sáng, mang lại màu sắc công nghiệp sống động, dịu mắt.
* **Vật liệu PBR Procedural:**
  * Sàn bê tông sơn Epoxy: Roughness 0.25, Metalness 0.05, có vệt bánh xe mờ.
  * Băng chuyền con lăn: UV texture scroll mô phỏng chuyển động xoay liên tục.

### 5.3 Hệ Thống Camera Đa Chế Độ (Smooth GSAP Tweens)
1. **Tactical Isometric:** Góc nhìn tổng quan nghiêng 45 độ, bao quát trọn vẹn luồng từ Inbound đến Outbound.
2. **Follow Entity Cam:** Bám theo góc nhìn người thứ ba của xe nâng FL-10 hoặc xe tải J&T khi di chuyển.
3. **Building Cutaway:** Bổ dọc mặt tiền nhà xưởng để nhìn thấu hoạt động của line đóng gói bên trong.
4. **Cinematic Fly-through:** Bay lướt điện ảnh qua các lối đi kệ cao tầng phục vụ thuyết trình/demo.

---

## 6. GIAO DIỆN NGƯỜI DÙNG & ĐA NGÔN NGỮ (UI/UX & i18n)

### 6.1 Bố Cục Giao Diện Điều Hành (Mission Control Layout)
* **Header Bar:** Thương hiệu Boxme, Đồng hồ mô phỏng, Chỉ báo ca (Ca A/B), Tốc độ (x1, x5, x15, x60), Bộ chọn ngôn ngữ (VI/EN/TH/ZH).
* **Metric Ribbon (14 KPI Cards):** Received, Released, Picked, Waiting IS, Packed, Handed, SLA Risk, Boxme FHR, Shopee FHR, TikTok FDR, TikTok LDR, Pack Cap %, Pick Cap %, Carrier Risk.
* **Left Panel - Risk Inbox:** Sắp xếp rủi ro theo thứ tự ưu tiên giảm dần, hiển thị nguyên nhân và hành động đề xuất.
* **Center Viewport - 3D Canvas:** Tích hợp các widget nổi (Số xe trên bãi, Số cửa bận, Nhân sự trên sàn, Stepper tiến trình Flow Tracking, Bảng xe cập dock).
* **Right Panel - Inspector:** Cây phân tích nguyên nhân gốc rễ (Root Cause Tree), Bán kính rủi ro SLA (Orders, Clients, Carriers), Dự báo thông lượng và Nút hành động (SIMULATE, ASSIGN).
* **Bottom Controls - Time-Travel Timeline:** Thanh trượt tua thời gian, vạch màu cảnh báo sự cố, nút tạo nhánh thử nghiệm và kích hoạt Monte Carlo.

### 6.2 Chuẩn Hóa Quốc Tế Hóa (i18n)
* **Bộ 4 ngôn ngữ:**
  * `vi`: Tiếng Việt (Thị trường Việt Nam - VSIP Bắc Ninh, Long An, Củ Chi).
  * `en`: English (Chuẩn quản trị quốc tế).
  * `th`: ภาษาไทย (Thị trường Thái Lan - Boxme Samut Prakan / Bangkok).
  * `zh`: 简体中文 (Thị trường Trung Quốc & Đối tác bán hàng xuyên biên giới Cross-border).
* **Giải pháp bố cục chống tràn chữ (Text Expansion Handling):**
  * Tiếng Việt và Tiếng Thái dài hơn Tiếng Anh từ 25% – 35%. Thiết kế toàn bộ card theo Flexbox/CSS Grid tự co giãn theo nội dung.
  * Font chữ: Hệ font đồng bộ kết hợp `Inter` (EN/VI), `Noto Sans Thai` (TH), và `Noto Sans SC` (ZH).
  * Chuẩn hóa định dạng số/ngày tháng bằng `Intl.NumberFormat` và `Intl.DateTimeFormat`.

---

## 7. CẤU TRÚC MÃ NGUỒN TÁCH FILE (Source Code Modularization)

```
src/
├── main.tsx
├── App.tsx
├── simulation/                  # [Lõi Mô Phỏng Độc Lập]
│   ├── engine.ts                # Discrete timestep engine
│   ├── prng.ts                  # Mulberry32 deterministic generator
│   ├── queueModel.ts            # Queue theory & stage transitions
│   ├── slaPredictor.ts          # SLA calculations (FHR, FDR, LDR)
│   ├── dataImporter.ts          # JSON/CSV/Parameters loader
│   ├── scenarios/               # 10.10 spike, regular day, carrier delay
│   └── monteCarlo/              # Web Worker parallel Monte Carlo
│       ├── mcWorker.ts          # Worker headless runner
│       └── distributions.ts     # Box-Muller, Poisson, Lognormal
│
├── game/                        # [Cơ Chế Game & Quyết Định]
│   ├── actionManager.ts         # Command pattern implementation
│   ├── snapshotDag.ts           # State tree for time-travel & branching
│   ├── scoreEvaluator.ts        # Shift performance & cost vs save scoring
│   └── gameLoop.ts              # Fixed tick vs RAF coordination
│
├── engine/                      # [Engine Đồ Họa Three.js]
│   ├── WarehouseEngine.ts       # Main WebGL lifecycle & render loop
│   ├── CameraManager.ts         # Isometric, Chase, Cutaway, Fly-cam
│   ├── LightingSystem.ts        # Hemi, Sun shadow caster, fill light
│   ├── PostProcessing.ts        # N8AO, UnrealBloom, ACESFilmicToneMapping
│   ├── materials/               # PBR textures & materials registry
│   ├── shaders/                 # SDF Zone box, pulse ring, shockwaves
│   ├── overlays/                # CSS2D labels & collision resolution
│   └── entities/                # Procedural 3D modules
│       ├── Building.ts          # Walls, canopy, animated dock doors
│       ├── RackSystem.ts        # High bays, pack benches, pick zones
│       ├── FleetTrucks.ts       # Articulated trucks & Catmull-Rom routes
│       ├── Forklifts.ts         # Forklifts with lifting carriage
│       ├── Conveyors.ts         # Animated rollers & belt boxes
│       ├── WorkerCrowd.ts       # InstancedMesh animated workers
│       └── BoxInstances.ts      # InstancedMesh dynamic box stacks
│
├── stores/                      # [Zustand State Stores]
│   ├── simulationStore.ts       # Clock, playback speed, paused state
│   ├── decisionStore.ts         # History, active branch, actions
│   ├── kpiStore.ts              # Real-time KPI metrics
│   └── uiStore.ts               # Camera mode, active drawer, language
│
├── i18n/                        # [Đa Ngôn Ngữ]
│   ├── index.ts                 # i18next configuration
│   └── locales/                 # vi.json, en.json, th.json, zh.json
│
└── components/                  # [React 19 Components]
    ├── header/                  # Mission control top bar & language select
    ├── kpis/                    # 14 KPI Cards
    ├── riskInbox/               # Risk cards list
    ├── inspector/               # Root cause tree, blast radius, actions
    ├── timeline/                # Time scrubber & branching buttons
    ├── modals/                  # Monte Carlo chart, Data Importer, Scenarios
    └── viewport/                # Canvas container & floating quick HUD
```

---

## 8. KẾ HOẠCH BẢO LƯU & GIAI ĐOẠN NGHIÊN CỨU TIẾP THEO (Research Staging)

Tài liệu này được lưu trữ tại `docs/superpowers/specs/2026-10-06-boxme-simulator-openspec.md` để đóng vai trò làm **Bản thiết kế nền tảng (OpenSpec Blueprint)**. 

### Các chủ đề nghiên cứu sâu tiếp theo (trước khi bắt tay vào code):
1. **Nghiên cứu Tích hợp API Dữ liệu Kho Thật:** Chuẩn hóa JSON schema đầu vào để có thể xuất trực tiếp từ hệ thống Boxme OMS/WMS sang định dạng nạp vào simulator.
2. **Nghiên cứu AI Recommendation Engine:** Thử nghiệm đưa một mô hình suy luận (hoặc quy tắc heuristic nâng cao) tự động đề xuất phương án can thiệp tối ưu nhất kèm giải thích lý do cho quản lý kho.
3. **Nghiên cứu Vertex Animation Textures (VAT):** Thử nghiệm bake animation cho công nhân 3D để nâng số lượng nhân sự hiển thị từ 200 lên 1.000 công nhân mà vẫn giữ vững 120 FPS.
4. **Nghiên cứu Cơ chế Chấm Điểm Game Tycoon:** Thiết kế hệ thống nhiệm vụ theo ca (Shift Challenges), huy hiệu hoàn thành xuất sắc và bảng xếp hạng tối ưu hóa chi phí.
