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

  it('should create IndustrialForklift with mast, forks, counterweight and loaded cargo', () => {
    const fl = LowPolyWarehouseFactory.createIndustrialForklift();
    assert.ok(fl instanceof THREE.Group);
    assert.equal(fl.name, 'IndustrialForklift');
    const box = new THREE.Box3().setFromObject(fl);
    assert.ok(box.min.y >= -0.05, 'Forklift must be grounded at floor level');
    assert.ok(box.max.y >= 2.2, 'Mast and cage should reach over 2.2m');
  });

  it('should create ConveyorSegment with rollers and moving parcels', () => {
    const conv = LowPolyWarehouseFactory.createConveyorSegment({ length: 3.0 });
    assert.ok(conv instanceof THREE.Group);
    assert.equal(conv.name, 'ConveyorSegment');
    const box = new THREE.Box3().setFromObject(conv);
    assert.ok(box.max.z - box.min.z >= 2.8, 'Conveyor length should be ~3m');
    assert.ok(box.max.y >= 0.7, 'Working height should be standard ~0.75m');
  });

  it('should create PackStationWithAndon with KCS screen and status lamp', () => {
    const station = LowPolyWarehouseFactory.createPackStationWithAndon();
    assert.ok(station instanceof THREE.Group);
    assert.equal(station.name, 'PackStationAndon');
    const box = new THREE.Box3().setFromObject(station);
    assert.ok(box.max.y >= 1.6, 'Andon mast should reach ~1.75m');
  });

  it('should create SelectiveRack3Tier with 6 pallet positions and 4.2m columns', () => {
    const rack3 = LowPolyWarehouseFactory.createSelectiveRack3Tier();
    assert.ok(rack3 instanceof THREE.Group);
    assert.equal(rack3.name, 'SelectiveRack3Tier');
    const box = new THREE.Box3().setFromObject(rack3);
    assert.ok(box.max.y >= 4.0, '3-tier rack uprights should reach 4.2m');
  });

  it('should create SortingFlowRack with inclined shelves and sorting totes', () => {
    const flow = LowPolyWarehouseFactory.createSortingFlowRack();
    assert.ok(flow instanceof THREE.Group);
    assert.equal(flow.name, 'SortingFlowRack');
    const box = new THREE.Box3().setFromObject(flow);
    assert.ok(box.max.y >= 1.7, 'Rack height should be ~1.85m');
  });

  it('should create MobileStagingCart with wire mesh sides and parcels', () => {
    const cart = LowPolyWarehouseFactory.createMobileStagingCart();
    assert.ok(cart instanceof THREE.Group);
    assert.equal(cart.name, 'MobileStagingCart');
    const box = new THREE.Box3().setFromObject(cart);
    assert.ok(box.max.y >= 1.7, 'Staging cart height should be ~1.85m');
  });

  it('should create GuardhouseBarrier with security booth and moving gate arm', () => {
    const gh = LowPolyWarehouseFactory.createGuardhouseBarrier();
    assert.ok(gh instanceof THREE.Group);
    assert.equal(gh.name, 'GuardhouseBarrier');
    const box = new THREE.Box3().setFromObject(gh);
    assert.ok(box.max.y >= 2.4, 'Booth roof should reach ~2.5m');
  });

  it('should create HighBayStreetLight with 7.6m pole and LED fixture', () => {
    const light = LowPolyWarehouseFactory.createHighBayStreetLight();
    assert.ok(light instanceof THREE.Group);
    assert.equal(light.name, 'HighBayStreetLight');
    const box = new THREE.Box3().setFromObject(light);
    assert.ok(box.max.y >= 7.0, 'Yard light pole must reach over 7m');
  });

  it('should create FireSafetyHydrant with concrete base and dual discharge valves', () => {
    const hyd = LowPolyWarehouseFactory.createFireSafetyHydrant();
    assert.ok(hyd instanceof THREE.Group);
    assert.equal(hyd.name, 'FireSafetyHydrant');
    const box = new THREE.Box3().setFromObject(hyd);
    assert.ok(box.max.y >= 1.0, 'Hydrant standpipe should reach ~1.1m');
  });

  it('should create IndustrialTrashBin, BufferPalletStack, and LandscapeTree', () => {
    const bin = LowPolyWarehouseFactory.createIndustrialTrashBin();
    assert.ok(bin instanceof THREE.Group);
    assert.equal(bin.name, 'IndustrialTrashBin');

    const buf = LowPolyWarehouseFactory.createBufferPalletStack();
    assert.ok(buf instanceof THREE.Group);
    assert.equal(buf.name, 'BufferPalletStack');

    const tree = LowPolyWarehouseFactory.createLandscapeTree();
    assert.ok(tree instanceof THREE.Group);
    assert.equal(tree.name, 'LandscapeTree');
    const treeBox = new THREE.Box3().setFromObject(tree);
    assert.ok(treeBox.max.y >= 3.0, 'Tree canopy should reach over 3m');
  });

  it('should create complete StarterWarehouseDiorama with floor, racks, truck, and workers', () => {
    const diorama = LowPolyWarehouseFactory.createStarterWarehouseDiorama();
    assert.ok(diorama instanceof THREE.Group);
    assert.equal(diorama.name, 'StarterWarehouseDiorama');
    assert.ok(diorama.children.length >= 8, 'Diorama should contain all warehouse operational elements');
  });
});


