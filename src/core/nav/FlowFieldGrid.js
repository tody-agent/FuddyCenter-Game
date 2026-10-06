/**
 * FlowFieldGrid
 * Hệ thống điều hướng ma trận luồng (Flow Field / Dijkstra Map)
 * Cung cấp tra cứu vector di chuyển với độ phức tạp O(1) cho hàng trăm robot AMR và thợ kho
 */
export class FlowFieldGrid {
  constructor({ width = 50, height = 50 } = {}) {
    this.width = width;
    this.height = height;
    const size = width * height;

    this.obstacles = new Uint8Array(size); // 1 = Obstacle (kệ, tường), 0 = Đường đi
    this.distance = new Float32Array(size);
    this.flowX = new Float32Array(size);
    this.flowY = new Float32Array(size);

    this.targetX = -1;
    this.targetY = -1;
  }

  index(x, y) {
    return y * this.width + x;
  }

  inBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  setObstacle(x, y, isObstacle = true) {
    if (!this.inBounds(x, y)) return;
    this.obstacles[this.index(x, y)] = isObstacle ? 1 : 0;
  }

  isObstacle(x, y) {
    if (!this.inBounds(x, y)) return true;
    return this.obstacles[this.index(x, y)] === 1;
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  getDistance(x, y) {
    if (!this.inBounds(x, y)) return Infinity;
    return this.distance[this.index(x, y)];
  }

  getFlowVector(x, y) {
    const rx = Math.floor(x);
    const ry = Math.floor(y);
    if (!this.inBounds(rx, ry)) return [0, 0];
    const idx = this.index(rx, ry);
    return [this.flowX[idx], this.flowY[idx]];
  }

  /**
   * Tính toán lại Integration Field (Dijkstra Map) và Vector Field
   */
  compute() {
    if (this.targetX < 0 || this.targetY < 0) return;

    const size = this.width * this.height;
    this.distance.fill(65535); // Infinity đại diện
    this.flowX.fill(0);
    this.flowY.fill(0);

    const targetIdx = this.index(this.targetX, this.targetY);
    this.distance[targetIdx] = 0;

    // 1. BFS lan truyền Dijkstra Map
    const queue = [ [this.targetX, this.targetY] ];
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, 1], [1, -1], [-1, -1]
    ];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      const currentDist = this.distance[this.index(cx, cy)];

      for (let i = 0; i < dirs.length; i++) {
        const nx = cx + dirs[i][0];
        const ny = cy + dirs[i][1];

        if (this.inBounds(nx, ny) && !this.isObstacle(nx, ny)) {
          const nIdx = this.index(nx, ny);
          const isDiag = dirs[i][0] !== 0 && dirs[i][1] !== 0;
          const cost = isDiag ? 1.414 : 1.0;
          const newDist = currentDist + cost;

          if (newDist < this.distance[nIdx]) {
            this.distance[nIdx] = newDist;
            queue.push([nx, ny]);
          }
        }
      }
    }

    // 2. Tính toán Vector Field hướng về ô lân cận có khoảng cách nhỏ nhất
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cIdx = this.index(x, y);

        if (this.isObstacle(x, y) || (x === this.targetX && y === this.targetY)) {
          this.flowX[cIdx] = 0;
          this.flowY[cIdx] = 0;
          continue;
        }

        let minD = this.distance[cIdx];
        let bestDir = [0, 0];

        for (let i = 0; i < dirs.length; i++) {
          const nx = x + dirs[i][0];
          const ny = y + dirs[i][1];

          if (this.inBounds(nx, ny) && !this.isObstacle(nx, ny)) {
            const d = this.distance[this.index(nx, ny)];
            if (d < minD) {
              minD = d;
              bestDir = [dirs[i][0], dirs[i][1]];
            }
          }
        }

        // Chuẩn hóa vector
        const len = Math.hypot(bestDir[0], bestDir[1]);
        if (len > 0) {
          this.flowX[cIdx] = bestDir[0] / len;
          this.flowY[cIdx] = bestDir[1] / len;
        }
      }
    }
  }
}
