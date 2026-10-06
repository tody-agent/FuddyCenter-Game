import { createWorld, addEntity, addComponent, query } from 'bitecs';
import { Position, Velocity, Parcel, ConveyorCarrier } from './components.js';

/**
 * WarehouseSimulation
 * Lõi mô phỏng logistics hiệu năng cao dựa trên bitECS 0.4.0 & Fixed-Tick Loop
 */
export class WarehouseSimulation {
  constructor() {
    this.world = createWorld();
    this.currentTick = 0;
  }

  /**
   * Sinh một kiện hàng mới trong kho
   */
  spawnParcel({ x = 0, y = 0, z = 0, weightGrams = 200, targetStation = 0 } = {}) {
    const eid = addEntity(this.world);
    addComponent(this.world, eid, Position);
    addComponent(this.world, eid, Parcel);

    Position.x[eid] = x;
    Position.y[eid] = y;
    Position.z[eid] = z;

    Parcel.weightGrams[eid] = weightGrams;
    Parcel.targetStation[eid] = targetStation;
    Parcel.status[eid] = 0; // Inbound

    return eid;
  }

  /**
   * Đặt kiện hàng lên băng chuyền
   */
  attachToConveyor(eid, { speed = 1.0, conveyorId = 1 } = {}) {
    addComponent(this.world, eid, ConveyorCarrier);
    ConveyorCarrier.speed[eid] = speed;
    ConveyorCarrier.conveyorId[eid] = conveyorId;
  }

  /**
   * Vòng lặp mô phỏng Fixed Tick
   * @param {number} dt Thời gian tick (giây)
   */
  tick(dt = 0.033) {
    this.currentTick++;

    // 1. Hệ thống di chuyển băng chuyền
    const conveyorEntities = query(this.world, [Position, ConveyorCarrier]);
    for (let i = 0; i < conveyorEntities.length; i++) {
      const eid = conveyorEntities[i];
      Position.x[eid] += ConveyorCarrier.speed[eid] * dt;
    }

    // 2. Hệ thống vận tốc tự do (xe nâng, AGV)
    const velocityEntities = query(this.world, [Position, Velocity]);
    for (let i = 0; i < velocityEntities.length; i++) {
      const eid = velocityEntities[i];
      Position.x[eid] += Velocity.vx[eid] * dt;
      Position.y[eid] += Velocity.vy[eid] * dt;
      Position.z[eid] += Velocity.vz[eid] * dt;
    }
  }
}
