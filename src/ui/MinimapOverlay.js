/**
 * MinimapOverlay
 * Vẽ sơ đồ kho vận 2D tốc độ cao (Inbound, High Bay, IS Buffer, Sorter, Docks)
 */
export class MinimapOverlay {
  constructor({ canvas, width = 300, height = 200 } = {}) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  drawWarehouseLayout() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Nền tối Cyber Logistics
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, this.width, this.height);

    // Khu vực Inbound (Xanh Cobalt)
    ctx.fillStyle = 'rgba(30, 88, 252, 0.2)';
    ctx.strokeStyle = '#1e58fc';
    ctx.strokeRect(10, 10, 60, 40);
    ctx.fillRect(10, 10, 60, 40);

    // Khu vực Kệ High Bay (Xanh Sky)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(80, 10, 140, 120);
    ctx.fillRect(80, 10, 140, 120);

    // Khu vực Sorter & Outbound (Hổ phách Amber)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(230, 50, 60, 80);
    ctx.fillRect(230, 50, 60, 80);
  }

  drawEntities(entities) {
    if (!this.ctx || !entities) return;
    const ctx = this.ctx;

    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      ctx.fillStyle = e.type === 'robot' ? '#10b981' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
