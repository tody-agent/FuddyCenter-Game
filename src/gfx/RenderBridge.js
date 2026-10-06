/**
 * RenderBridge: Bộ cầu nối nội suy (LERP) giữa Fixed-Tick Simulation và Render Loop 60-120 FPS
 */
export class RenderBridge {
  constructor() {
    this.states = new Map();
  }

  recordState(eid, pos) {
    let entry = this.states.get(eid);
    if (!entry) {
      this.states.set(eid, { prev: { ...pos }, curr: { ...pos } });
    } else {
      entry.prev = { ...entry.curr };
      entry.curr = { ...pos };
    }
  }

  getInterpolatedPosition(eid, alpha = 1.0) {
    const entry = this.states.get(eid);
    if (!entry) return { x: 0, y: 0, z: 0 };
    return {
      x: entry.prev.x + (entry.curr.x - entry.prev.x) * alpha,
      y: entry.prev.y + (entry.curr.y - entry.prev.y) * alpha,
      z: entry.prev.z + (entry.curr.z - entry.prev.z) * alpha
    };
  }
}
