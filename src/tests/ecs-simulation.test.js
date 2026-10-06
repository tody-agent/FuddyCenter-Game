import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { WarehouseSimulation } from '../core/ecs/WarehouseSimulation.js';
import { Position, Parcel, ConveyorCarrier } from '../core/ecs/components.js';

describe('bitECS Warehouse Simulation Core Tests', () => {
  test('WarehouseSimulation should initialize bitECS world and spawn parcels', () => {
    const sim = new WarehouseSimulation();
    const eid = sim.spawnParcel({
      x: 10,
      y: 0,
      z: 5,
      weightGrams: 500,
      targetStation: 1
    });

    assert.ok(typeof eid === 'number', 'Spawned entity should return numeric ID');
    assert.equal(Position.x[eid], 10);
    assert.equal(Position.z[eid], 5);
    assert.equal(Parcel.weightGrams[eid], 500);
    assert.equal(Parcel.targetStation[eid], 1);
  });

  test('WarehouseSimulation should update parcel position along conveyor during tick', () => {
    const sim = new WarehouseSimulation();
    const eid = sim.spawnParcel({
      x: 0,
      y: 0,
      z: 0,
      weightGrams: 200,
      targetStation: 2
    });

    sim.attachToConveyor(eid, { speed: 2.0, conveyorId: 10 });

    // Tick 1 second (dt = 1.0)
    sim.tick(1.0);

    assert.equal(Position.x[eid], 2.0, 'Parcel position X should advance by speed * dt');
  });

  test('WarehouseSimulation should handle 10,000 entities without stutter or crash', () => {
    const sim = new WarehouseSimulation();
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      const eid = sim.spawnParcel({
        x: i % 100,
        y: 0,
        z: Math.floor(i / 100),
        weightGrams: 300,
        targetStation: i % 5
      });
      sim.attachToConveyor(eid, { speed: 1.5, conveyorId: i % 10 });
    }

    // Run 10 fixed simulation ticks
    for (let t = 0; t < 10; t++) {
      sim.tick(0.033);
    }

    const duration = performance.now() - start;
    assert.ok(duration < 500, `10,000 entities 10 ticks should complete in under 500ms (Actual: ${duration.toFixed(1)}ms)`);
  });
});
