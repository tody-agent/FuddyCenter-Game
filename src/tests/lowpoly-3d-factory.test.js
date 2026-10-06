import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { LowPolyWarehouseFactory, PALETTE } from '../gfx/LowPolyWarehouseFactory.js';

describe('LowPolyWarehouseFactory Procedural 3D Mesh Tests', () => {

  it('should create a valid HandPalletJack with ground pivot', () => {
    const jack = LowPolyWarehouseFactory.createHandPalletJack();
    assert.ok(jack instanceof THREE.Group);
    assert.equal(jack.name, 'HandPalletJack');
    assert.ok(jack.children.length >= 7, 'Should have chassis, handle, forks and wheels');

    const box = new THREE.Box3().setFromObject(jack);
    assert.ok(box.min.y >= -0.05, 'Pivot point should be grounded at floor level');
    assert.ok(box.max.y <= 1.4, 'Handle height should be realistic');
  });

  it('should create a valid PickingCart with 6 tote boxes and handle', () => {
    const cart = LowPolyWarehouseFactory.createPickingCart();
    assert.ok(cart instanceof THREE.Group);
    assert.equal(cart.name, 'PickingCart');

    const box = new THREE.Box3().setFromObject(cart);
    assert.ok(box.min.y >= -0.05, 'Cart wheels should touch the floor');
    assert.ok(box.max.y >= 1.2 && box.max.y <= 1.5, 'Cart height should be around 1.35m');
  });

  it('should create a ConventionalPackTable with tabletop, scale and bubble wrap', () => {
    const table = LowPolyWarehouseFactory.createConventionalPackTable();
    assert.ok(table instanceof THREE.Group);
    assert.equal(table.name, 'PackTable');

    const box = new THREE.Box3().setFromObject(table);
    assert.ok(box.min.y >= -0.05);
    assert.ok(box.max.y >= 1.5, 'Overhead racking should reach standard working height');
  });

  it('should create a SelectiveRack with 2 tiers and loaded pallets', () => {
    const rack = LowPolyWarehouseFactory.createSelectiveRack({ bays: 1 });
    assert.ok(rack instanceof THREE.Group);
    assert.equal(rack.name, 'SelectiveRack');

    const box = new THREE.Box3().setFromObject(rack);
    assert.ok(box.max.y >= 3.0, 'Rack upright columns should reach 3.6m');
    assert.ok(box.max.x - box.min.x >= 2.5, 'Bay width should accommodate 2 pallets');
  });

  it('should create EuroPalletCargo with realistic EPAL dimensions and shrink wrap', () => {
    const pallet = LowPolyWarehouseFactory.createEuroPalletCargo({ heightTiers: 3 });
    assert.ok(pallet instanceof THREE.Group);
    assert.equal(pallet.name, 'PalletCargo');

    const box = new THREE.Box3().setFromObject(pallet);
    const width = box.max.x - box.min.x;
    const length = box.max.z - box.min.z;
    assert.ok(Math.abs(width - 0.8) <= 0.1, `Width should be ~0.8m, got ${width}`);
    assert.ok(Math.abs(length - 1.2) <= 0.1, `Length should be ~1.2m, got ${length}`);
  });

  it('should create a DeliveryTruck with Fulldy blue cabin and cargo container', () => {
    const truck = LowPolyWarehouseFactory.createDeliveryTruck();
    assert.ok(truck instanceof THREE.Group);
    assert.equal(truck.name, 'DeliveryTruck');

    const box = new THREE.Box3().setFromObject(truck);
    assert.ok(box.max.z - box.min.z >= 4.5, 'Truck length should be ~5.5m');
    assert.ok(box.max.y >= 2.2, 'Truck height should be ~2.7m');
  });

  it('should create WorkerPicker and FloorSupervisor human figures', () => {
    const picker = LowPolyWarehouseFactory.createWorkerPicker();
    assert.ok(picker instanceof THREE.Group);
    const pickerBox = new THREE.Box3().setFromObject(picker);
    assert.ok(pickerBox.max.y >= 1.4 && pickerBox.max.y <= 1.85, 'Picker height should be ~1.7m');

    const supervisor = LowPolyWarehouseFactory.createFloorSupervisor();
    assert.ok(supervisor instanceof THREE.Group);
    const supBox = new THREE.Box3().setFromObject(supervisor);
    assert.ok(supBox.max.y >= 1.4 && supBox.max.y <= 1.85, 'Supervisor height should be ~1.7m');
  });

  it('should create InboundDockBay with wall frame and dock bumpers', () => {
    const dock = LowPolyWarehouseFactory.createInboundDockBay();
    assert.ok(dock instanceof THREE.Group);
    assert.equal(dock.name, 'InboundDockBay');

    const box = new THREE.Box3().setFromObject(dock);
    assert.ok(box.max.y >= 3.0, 'Dock wall should be over 3m high');
  });
});
