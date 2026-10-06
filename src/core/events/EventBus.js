/**
 * SimulationEventBus
 * Giao diện phát và lắng nghe sự kiện decoupled cho Fulldy Center Simulator
 */
export class SimulationEventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    if (!this.listeners.has(eventType)) return;
    const list = this.listeners.get(eventType);
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(eventType, payload) {
    if (!this.listeners.has(eventType)) return;
    const callbacks = this.listeners.get(eventType);
    for (let i = 0; i < callbacks.length; i++) {
      try {
        callbacks[i](payload);
      } catch (err) {
        console.error(`[EventBus] Error in listener for event ${eventType}:`, err);
      }
    }
  }

  clear() {
    this.listeners.clear();
  }
}
