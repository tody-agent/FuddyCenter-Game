# 🎮 BÁO CÁO NGHIÊN CỨU & THIẾT KẾ KIẾN TRÚC: GAME ENGINE, RUNTIME LIBRARIES & AGENT SKILLS CHO BOXME MISSION CONTROL 2.0

> **Mã tài liệu:** ARCH-GAMEDEV-SECURITY-2026-10-06  
> **Dự án:** Boxme Mission Control — 3D Digital Twin & Fulfillment Center Simulator (VSIP Bắc Ninh)  
> **Phạm vi:** Đánh giá an ninh chuỗi cung ứng, Thư viện runtime hiệu năng cao (bitECS, Flow Field, Three.js, PixiJS), và Quy trình làm sạch Agent Skills (Clean-room Prompt Extraction).

---

## 1. TỔNG QUAN & XÁC NHẬN ĐÁNH GIÁ AN NINH (SECURITY VERIFICATION)

Đánh giá ban đầu của bạn về bề mặt tấn công của các bộ GameDev Skills và Hooks là **hoàn toàn chính xác, sắc bén và bám sát các nghiên cứu an ninh mới nhất (Snyk ToxicSkills, Datadog Security Labs, CVE-2025-59536)**.

### 1.1 Ba lỗ hổng cốt tử trong hệ sinh thái Agent Skills
1. **Dynamic Context Injection (`!\`command\``)**:
   - Khi file `SKILL.md` chứa cú pháp dynamic context, runtime của agent sẽ fork shell để thực thi lệnh **ngay tại thời điểm parse file**, trước khi Model kịp đọc hay đánh giá rủi ro. Kể cả khi Prompt cấm chạy code độc hại, token/credential đã bị đánh cắp trước đó.
2. **Hook RCE & Quản lý Secret thiếu an toàn**:
   - Các hook trong `.claude/settings.json` hoặc scripts khởi tạo tự chạy khi mở phiên. Việc sử dụng `set -a; . .env` là lỗ hổng thực thi mã tùy ý (Arbitrary Code Execution) nếu biến môi trường bị can thiệp.
3. **Lây nhiễm Giấy phép (License Contamination - AGPL-3.0)**:
   - Thư viện âm thanh Strudel trong `game-creator` mang giấy phép **AGPL-3.0**. Nếu tích hợp trực tiếp vào Boxme Mission Control (sản phẩm thương mại proprietary), toàn bộ mã nguồn của Boxme Global có nguy cơ bị buộc phải mở mã nguồn.

### 1.2 Ma trận phân loại hành động (Action Matrix)
| Bộ Skill / Repo | Mức rủi ro | Hành động chiến lược | Biện pháp kiểm soát |
|---|---|---|---|
| **anthropics/skills** | Thấp | ✅ Sử dụng trực tiếp | Dùng `frontend-design`, `webapp-testing` cho Playwright E2E. |
| **pixijs/pixijs-skills** | Thấp | ✅ Sử dụng có chọn lọc | Khai thác kỹ thuật batching, viewport culling, shader 2D. |
| **phaser4-gamedev** | Thấp (ít audit) | 🟡 Vendor Prompt Only | Lấy logic phát hiện API lỗi thời, không nạp shell hook. |
| **Claude-Code-Game-Studios** | Thấp - Trung bình | 🟡 Clean-Room Extraction | Trích xuất 15-20 skills về Math Balance, Level Design, State Machine. Loại bỏ hoàn toàn 12 shell hooks và auto-pytest. |
| **awesome-gamedev-agent-skills** | Trung bình | 🟡 Audit từng file | Tắt Dynamic Router tự động nạp. |
| **game-creator** | **Rất cao** | ⛔ **Cách ly tuyệt đối (Quarantine)** | Chỉ đọc tham khảo ý tưởng kiến trúc (EventBus/GameState). Cấm cài `heredotnow`, cấm tích hợp Strudel AGPL-3.0. |

---

## 2. ĐỐI CHIẾU & THIẾT KẾ THƯ VIỆN RUNTIME CHO BOXME SIMULATOR

Ở quy mô Tier 4 (VSIP Bắc Ninh 20.000m²) và Tier 5 (Siêu Hub Không Đèn 40.000m²), hệ thống phải mô phỏng đồng thời:
- $10.000 - 50.000$ kiện hàng (parcels) trên băng chuyền và giá kệ.
- $100 - 300$ robot tự hành AMR và xe nâng Reach Truck.
- $60 - 200$ thợ kho (pickers, packers, VAS staff) với trạng thái thể lực/tâm lý thay đổi theo ca.

### 2.1 bitECS (Data-Oriented Entity Component System) — Trái Tim Của Mô Phỏng
- **Vấn đề của OOP truyền thống (`new Parcel()` / `new Worker()`)**:
  - Hàng vạn object phân mảnh rải rác trên RAM (Heap fragmentation).
  - CPU Cache Miss liên tục khi duyệt mảng object.
  - Vòng lặp dọn rác (Garbage Collection Pause) gây hiện tượng khựng khung hình (stuttering / FPS drop) khi đơn hàng ùa về trong đêm Mega Sale.
- **Tại sao bitECS là tiêu chuẩn vàng**:
  - bitECS tổ chức dữ liệu dưới dạng **TypedArray liên tục (ArrayBuffer / Structure of Arrays - SoA)**.
  - CPU nạp dữ liệu vào L1/L2 Cache cực nhanh (Data Locality).
  - Không sinh ra rác (Zero GC Allocations trong Simulation Tick), duy trì 60 FPS mượt mà kể cả khi mô phỏng $50.000$ thực thể.

```typescript
// Mẫu kiến trúc bitECS cho Kiện hàng (Parcels) trong Boxme Simulator
import { createWorld, defineComponent, Types, addEntity, addComponent } from 'bitecs';

export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32
});

export const ParcelState = defineComponent({
  status: Types.ui8,     // 0: Inbound, 1: Slotted, 2: Picking, 3: IS_Buffer, 4: Packed, 5: Dispatched
  targetStation: Types.ui16,
  weightGrams: Types.ui32,
  slaDeadlineTick: Types.ui32
});

export const ConveyorCarrier = defineComponent({
  conveyorId: Types.ui16,
  speed: Types.f32,
  progress: Types.f32
});
```

---

### 2.2 PathFinding.js vs Flow Field (Vector Field) Pathfinding
- **Hạn chế chết người của PathFinding.js (A\*)**:
  - Thuật toán $A^*$ tìm đường cho từng agent riêng lẻ với độ phức tạp $O(K \cdot N \log N)$.
  - Khi $200$ robot AMR cùng cần di chuyển về cụm trạm đóng gói (Packing Station E1-E3), chạy $200$ lượt $A^*$ trên bản đồ $500 \times 500$ cells sẽ tiêu tốn $100\%$ CPU, làm treo trình duyệt.
- **Giải pháp: Flow Field (Dijkstra Map + Vector Field)**:
  - Tính toán một ma trận hướng đi (Direction Map / Gradient Field) **một lần duy nhất** cho mỗi cụm đích đến chung (ví dụ: Cửa xuất hàng Docks, Trạm Đóng gói).
  - Mọi robot hoặc thợ kho chỉ cần tra cứu ô tọa độ của mình để lấy vector di chuyển với độ phức tạp **$O(1)$**!
  - Kết hợp với **RVO (Reciprocal Velocity Obstacles)** để các xe AMR tự tránh va chạm cục bộ khi cắt mặt nhau trên luồng di chuyển chính.

---

### 2.3 Phối Hợp Engine Đồ Họa: Three.js (3D) + PixiJS (2D HUD/Schematic)
- **Three.js (Core 3D Viewport)**:
  - Giữ vai trò hiển thị 3D Digital Twin: kết cấu nhà xưởng Mezzanine 3 tầng, kệ Selective/High Bay, cẩu ASRS 18m, ánh sáng ca đêm và shader công nghiệp.
  - Áp dụng kỹ thuật **GPU InstancedMesh** để vẽ hàng vạn thùng hàng trên kệ chỉ bằng **1 Draw Call**.
- **PixiJS v8 (High-speed 2D Data Overlay & Radar Minimap)**:
  - Three.js rất nặng khi vẽ hàng ngàn text label hoặc biểu đồ vector động.
  - Sử dụng PixiJS làm Canvas 2D lớp trên (hoặc OffscreenCanvas) cho:
    1. Bản đồ luồng nhiệt mật độ di chuyển (Heatmap Density Layer).
    2. Sơ đồ phân loại máng trượt (Sorter Chute Schematic Display).
    3. Minimap radar toàn kho thời gian thực.

---

### 2.4 Bài Học Kiến Trúc Từ shapez.io & OpenRCT2
1. **Mô hình Tách Rời (Decoupled Deterministic Simulation Tick Loop)** từ `shapez.io`:
   - **Simulation Tick** chạy cố định ở $30\text{ Hz}$ ($\Delta t = 33.3\text{ ms}$) trong Web Worker hoặc RequestAnimationFrame accumulator:
     $$\text{Tick}(T) = \text{State}_{T-1} + f(\text{Inputs}, \Delta t)$$
   - **Render Loop** chạy theo màn hình ($60 - 144\text{ Hz}$):
     $$\text{VisualPos} = \text{lerp}(\text{Pos}_{T-1}, \text{Pos}_T, \alpha) \quad \text{với } \alpha = \frac{\text{accumulator}}{\text{tickDuration}}$$
   - **Lợi ích tối thượng**: Cho phép tính năng **Fast-Forward (Tua nhanh 2x, 5x, 10x)** khi kiểm thử kịch bản bão đơn Mega Sale mà tính toán kinh tế và vận hành không hề bị sai lệch hay giật lag!
2. **State Machine Nhân Công & Khách Hàng** từ `OpenRCT2`:
   - Quản lý trạng thái thợ kho qua Finite State Machine (FSM):
     $$\text{IDLE} \xrightarrow{\text{Nhận Wave}} \text{WALK\_TO\_BIN} \xrightarrow{\text{Đến nơi}} \text{SCAN\_SKU} \xrightarrow{\text{Lấy hàng}} \text{PUT\_TOTE} \xrightarrow{\text{Đầy xe}} \text{ROUTE\_TO\_IS\_BUFFER}$$
   - Cơ chế suy giảm thể lực sau 6 tiếng cao điểm và áp lực cơm ca được tính toán trực tiếp vào xác suất quét sai mã vạch barcode.

---

## 3. THIẾT KẾ BỘ SỰ KIỆN EVENTBUS & BẢO VỆ CHỐNG "VÒNG XOÁY TỬ THẦN"

Để hiện thực hóa triết lý *"Constraint-Surfing"* và **3 Chốt chặn Ngắt mạch (Circuit Breakers)** trong `FINAL_PRODUCT_MASTER_BLUEPRINT.md`:

```typescript
// Core EventBus & Death Spiral Guard Architecture
export type GameEventType = 
  | 'PARCEL_CREATED'
  | 'SLA_NEAR_BREACH'
  | 'SLA_BREACHED'
  | 'CASH_DEFICIT'
  | 'EMERGENCY_CREDIT_ACTIVATED'
  | 'MERCHANT_GRACE_WARNING'
  | 'TEMP_AGENCY_NO_SHOW';

export class SimulationEventBus {
  private listeners: Map<GameEventType, Array<(payload: any) => void>> = new Map();

  on(event: GameEventType, callback: (payload: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: GameEventType, payload: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(payload);
      }
    }
  }
}

// Chốt chặn ngắt mạch phá sản
export class CircuitBreakerSystem {
  static checkBankruptcyGuard(cash: number, eventBus: SimulationEventBus, state: any) {
    if (cash < 0 && !state.emergencyCreditActive) {
      state.emergencyCreditActive = true;
      state.boxmeCash += 50000; // Cấp hạn mức tín dụng khẩn cấp Boxme HQ
      eventBus.emit('EMERGENCY_CREDIT_ACTIVATED', { amount: 50000 });
    }
  }
}
```

---

## 4. QUY TRÌNH TRIỂN KHAI VÀ BỘ CÔNG CỤ ĐÃ THIẾT LẬP

Để đảm bảo toàn bộ quá trình phát triển diễn ra trong môi trường an toàn tuyệt đối:

1. **Script Audit Tự Động (`scripts/audit-gamedev-skills.py`)**:
   - Tự động quét và phát hiện các rủi ro: dynamic context injection `!cmd`, wildcard bash permissions, `set -a; . .env`, piping shell từ mạng, snoop credential nhạy cảm và lây nhiễm AGPL-3.0.
   - Chạy lệnh kiểm tra bất kỳ lúc nào:
     ```bash
     python3 scripts/audit-gamedev-skills.py [thư mục cần kiểm tra]
     ```
2. **Môi Trường Sandbox DevContainer (`.devcontainer/`)**:
   - File cấu hình `.devcontainer/devcontainer.json` và `Dockerfile` đã được tạo sẵn.
   - Chạy dưới user không đặc quyền `node`, cô lập hoàn toàn khỏi SSH key, AWS tokens hay git credentials của máy chủ host.
   - Tích hợp sẵn Node.js 22, Python 3, headless Chromium và các thư viện WebGL testing.

3. **Nguyên tắc "Prompt Extraction" đối với các Repo bên ngoài**:
   - Khi tham khảo các bộ skill như `Claude-Code-Game-Studios` hay `awesome-gamedev-agent-skills`:
     - **CHỈ copy phần nội dung hướng dẫn nghiệp vụ (Instructions & Domain Knowledge)** vào các file tài liệu trong `docs/` hoặc skill thuần túy.
     - **KHÔNG copy file cấu hình `.claude/settings.json`, file hook `.sh/.py` hoặc các scripts tự động**.
