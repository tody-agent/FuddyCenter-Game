import * as THREE from 'three';

/**
 * LowPolyWarehouseFactory: Bo tao hinh 3D khoi Low-Poly / Chunky Isometric chuyen dung cho Fulldy Center
 * 
 * Thiet ke theo triet ly Toy-like / Diorama Tycoon (Factorio, Two Point Hospital):
 * - Kich thuoc theo he met thuc te (1 don vi Three.js = 1 met)
 * - Diem neo Pivot Point luon nam tren mat san (y = 0)
 * - Palette mau nhan dien thuong hieu Fulldy (Cobalt Blue, Hazard Amber, Safety Sky)
 * - Khong su dung file 3D ben ngoai (tu dung procedural 100% tu BoxGeometry, CylinderGeometry)
 */

export const PALETTE = {
  fulldyCobalt: 0x1e58fc,
  fulldyBlueDark: 0x0f2c8f,
  safetySky: 0x38bdf8,
  hazardOrange: 0xf97316,
  hazardAmber: 0xf59e0b,
  cautionYellow: 0xfbbf24,
  slaNominal: 0x10b981,
  criticalAlarm: 0xef4444,
  cardboardKraft: 0xd97706,
  cardboardDark: 0xb45309,
  woodPallet: 0xca8a04,
  steelFrame: 0x334155,
  steelBeam: 0x475569,
  steelLight: 0x94a3b8,
  rubberBlack: 0x0f172a,
  concreteFloor: 0xe2e8f0,
  cleanWhite: 0xf8fafc,
  highVisVest: 0xa3e635,
  skinTone: 0xfbcfe8
};

// Cached Materials
const matCache = new Map();
function getMaterial(color, roughness = 0.5, metalness = 0.1, transparent = false, opacity = 1.0) {
  const key = `${color}_${roughness}_${metalness}_${transparent}_${opacity}`;
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent,
      opacity
    }));
  }
  return matCache.get(key);
}

export class LowPolyWarehouseFactory {

  /**
   * 1. Xe Nang Tay Thuy Luc (Manual Hand Pallet Jack)
   * Kich thuoc: 1.55m dai, 0.55m rong, 1.2m cao (can tay cam)
   */
  static createHandPalletJack(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'HandPalletJack';

    const matAmber = getMaterial(options.color || PALETTE.hazardAmber, 0.4, 0.2);
    const matSteel = getMaterial(PALETTE.steelFrame, 0.3, 0.5);
    const matBlack = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);

    // Than bom thuy luc
    const pumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8);
    const pumpMesh = new THREE.Mesh(pumpGeo, matSteel);
    pumpMesh.position.set(0, 0.32, -0.35);
    group.add(pumpMesh);

    // Can bom chu T (Handle)
    const shaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.85, 6);
    const shaftMesh = new THREE.Mesh(shaftGeo, matAmber);
    shaftMesh.position.set(0, 0.8, -0.5);
    shaftMesh.rotation.x = -0.35;
    group.add(shaftMesh);

    const gripGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 6);
    gripGeo.rotateZ(Math.PI / 2);
    const gripMesh = new THREE.Mesh(gripGeo, matBlack);
    gripMesh.position.set(0, 1.15, -0.63);
    group.add(gripMesh);

    // Khung cang nang (Forks: 2 thanh thep song song)
    const forkLen = 1.15;
    const forkWidth = 0.16;
    const forkHeight = 0.07;
    const forkGeo = new THREE.BoxGeometry(forkWidth, forkHeight, forkLen);

    const leftFork = new THREE.Mesh(forkGeo, matAmber);
    leftFork.position.set(-0.18, 0.1, 0.25);
    group.add(leftFork);

    const rightFork = new THREE.Mesh(forkGeo, matAmber);
    rightFork.position.set(0.18, 0.1, 0.25);
    group.add(rightFork);

    // Tam noi lien ket cang sau
    const bridgeGeo = new THREE.BoxGeometry(0.52, 0.18, 0.18);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, matAmber);
    bridgeMesh.position.set(0, 0.16, -0.28);
    group.add(bridgeMesh);

    // Banh lai kep phia sau (Steer Wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.07, 8);
    wheelGeo.rotateZ(Math.PI / 2);
    const leftWheel = new THREE.Mesh(wheelGeo, matBlack);
    leftWheel.position.set(-0.12, 0.09, -0.35);
    const rightWheel = new THREE.Mesh(wheelGeo, matBlack);
    rightWheel.position.set(0.12, 0.09, -0.35);
    group.add(leftWheel, rightWheel);

    // Banh nylon dau cang (Tandem Rollers)
    const rollerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6);
    rollerGeo.rotateZ(Math.PI / 2);
    const frontLeft = new THREE.Mesh(rollerGeo, matBlack);
    frontLeft.position.set(-0.18, 0.04, 0.75);
    const frontRight = new THREE.Mesh(rollerGeo, matBlack);
    frontRight.position.set(0.18, 0.04, 0.75);
    group.add(frontLeft, frontRight);

    return group;
  }

  /**
   * 2. Xe Day Gom Hang 3 Tang (Manual Picking Cart / Trolley)
   * Chuyen dung wave picking gom don kem 6 khay tote vang
   */
  static createPickingCart(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'PickingCart';

    const matBlue = getMaterial(PALETTE.fulldyCobalt, 0.4, 0.3);
    const matSteel = getMaterial(PALETTE.steelLight, 0.3, 0.6);
    const matYellow = getMaterial(PALETTE.cautionYellow, 0.5, 0.0);
    const matBlack = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);
    const matWhite = getMaterial(PALETTE.cleanWhite, 0.6, 0.0);

    const cartW = 0.65;
    const cartL = 1.1;
    const cartH = 1.35;

    // 4 Tru thep ong 4 goc
    const postGeo = new THREE.CylinderGeometry(0.02, 0.02, cartH, 6);
    const postOffsets = [
      [-cartW/2 + 0.03, -cartL/2 + 0.03],
      [ cartW/2 - 0.03, -cartL/2 + 0.03],
      [-cartW/2 + 0.03,  cartL/2 - 0.03],
      [ cartW/2 - 0.03,  cartL/2 - 0.03]
    ];
    postOffsets.forEach(([ox, oz]) => {
      const post = new THREE.Mesh(postGeo, matBlue);
      post.position.set(ox, cartH / 2 + 0.1, oz);
      group.add(post);
    });

    // 3 Tang mang do (Shelves: Day, Giua, Tren)
    const shelfGeo = new THREE.BoxGeometry(cartW, 0.03, cartL);
    const shelfLevels = [0.15, 0.65, 1.15];
    shelfLevels.forEach((sy, tierIndex) => {
      const shelf = new THREE.Mesh(shelfGeo, matBlue);
      shelf.position.set(0, sy, 0);
      group.add(shelf);

      // Dat 2 khay Tote vang moi tang
      [-cartL/4, cartL/4].forEach((tz, toteIdx) => {
        const tote = LowPolyWarehouseFactory.createSingleToteMesh(
          toteIdx % 2 === 0 ? PALETTE.cautionYellow : PALETTE.fulldyCobalt
        );
        tote.position.set(0, sy + 0.015, tz);
        group.add(tote);
      });
    });

    // Tay day phia sau (Ergonomic Handle)
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, cartW - 0.04, 6);
    handleGeo.rotateZ(Math.PI / 2);
    const handle = new THREE.Mesh(handleGeo, matSteel);
    handle.position.set(0, 1.05, -cartL/2 - 0.08);
    group.add(handle);

    // 4 Banh xe xoay 360 do
    const wheelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 8);
    wheelGeo.rotateZ(Math.PI / 2);
    postOffsets.forEach(([ox, oz]) => {
      const w = new THREE.Mesh(wheelGeo, matBlack);
      w.position.set(ox, 0.05, oz);
      group.add(w);
    });

    // Bang kep phieu xuat kho A4 (Clipboard)
    const clipGeo = new THREE.BoxGeometry(0.24, 0.32, 0.02);
    clipGeo.rotateX(-0.4);
    const clip = new THREE.Mesh(clipGeo, matWhite);
    clip.position.set(cartW/2 - 0.05, 1.25, -cartL/2);
    group.add(clip);

    return group;
  }

  /**
   * Helper tao 1 chiec khay Tote nhua don le
   */
  static createSingleToteMesh(color = PALETTE.cautionYellow) {
    const group = new THREE.Group();
    const mat = getMaterial(color, 0.4, 0.0);
    const matRim = getMaterial(PALETTE.steelFrame, 0.5, 0.2);

    // Day & than khay hop
    const bodyGeo = new THREE.BoxGeometry(0.48, 0.22, 0.38);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.set(0, 0.11, 0);
    group.add(body);

    // Vien loe mieng khay
    const rimGeo = new THREE.BoxGeometry(0.52, 0.03, 0.42);
    const rim = new THREE.Mesh(rimGeo, mat);
    rim.position.set(0, 0.22, 0);
    group.add(rim);

    // Khe dan tem ma vach barcode
    const labelGeo = new THREE.BoxGeometry(0.12, 0.06, 0.01);
    const label = new THREE.Mesh(labelGeo, getMaterial(PALETTE.cleanWhite, 0.8));
    label.position.set(0, 0.11, 0.195);
    group.add(label);

    return group;
  }

  /**
   * 3. Ban Dong Goi Thu Cong Mat Go (Conventional Packing Workstation)
   * Kich thuoc: 1.8m dai, 0.9m rong, 1.85m cao tong the
   */
  static createConventionalPackTable(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'PackTable';

    const matWood = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);
    const matFrame = getMaterial(PALETTE.steelFrame, 0.4, 0.4);
    const matCyan = getMaterial(PALETTE.safetySky, 0.3, 0.1, true, 0.7);
    const matWhite = getMaterial(PALETTE.cleanWhite, 0.5, 0.0);
    const matGreen = getMaterial(PALETTE.slaNominal, 0.2, 0.0);
    const matOrange = getMaterial(PALETTE.hazardOrange, 0.3, 0.1);

    const tableW = 1.8;
    const tableD = 0.9;
    const tableH = 0.85;

    // Mat ban go day 4cm
    const topGeo = new THREE.BoxGeometry(tableW, 0.05, tableD);
    const topMesh = new THREE.Mesh(topGeo, matWood);
    topMesh.position.set(0, tableH, 0);
    group.add(topMesh);

    // 4 Chan ban thep
    const legGeo = new THREE.BoxGeometry(0.06, tableH, 0.06);
    const legOffsets = [
      [-tableW/2 + 0.08, -tableD/2 + 0.08],
      [ tableW/2 - 0.08, -tableD/2 + 0.08],
      [-tableW/2 + 0.08,  tableD/2 - 0.08],
      [ tableW/2 - 0.08,  tableD/2 - 0.08]
    ];
    legOffsets.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, matFrame);
      leg.position.set(lx, tableH / 2, lz);
      group.add(leg);
    });

    // Khung thep treo tren cao (Overhead Racking Bar)
    const uprightH = 1.0;
    const barGeo = new THREE.BoxGeometry(0.04, uprightH, 0.04);
    const leftUpright = new THREE.Mesh(barGeo, matFrame);
    leftUpright.position.set(-tableW/2 + 0.08, tableH + uprightH/2, -tableD/2 + 0.08);
    const rightUpright = new THREE.Mesh(barGeo, matFrame);
    rightUpright.position.set(tableW/2 - 0.08, tableH + uprightH/2, -tableD/2 + 0.08);
    group.add(leftUpright, rightUpright);

    // Ke ngang de thung carton phang
    const shelfGeo = new THREE.BoxGeometry(tableW, 0.03, 0.35);
    const shelf = new THREE.Mesh(shelfGeo, matFrame);
    shelf.position.set(0, tableH + 0.85, -tableD/2 + 0.18);
    group.add(shelf);

    // Cac thung carton phang xep dung tren ke
    for (let i = 0; i < 6; i++) {
      const cartonFlat = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.35, 0.28),
        getMaterial(PALETTE.cardboardDark, 0.7)
      );
      cartonFlat.position.set(-0.6 + i * 0.12, tableH + 1.04, -tableD/2 + 0.18);
      group.add(cartonFlat);
    }

    // Cuon xop no bong khi (Bubble Wrap Roll)
    const rollGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 12);
    rollGeo.rotateZ(Math.PI / 2);
    const roll = new THREE.Mesh(rollGeo, matCyan);
    roll.position.set(0, tableH + 0.45, -tableD/2 + 0.15);
    group.add(roll);

    // Can ban dien tu KCS (Weigh Scale)
    const scaleBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.35), matFrame);
    scaleBase.position.set(-0.5, tableH + 0.045, 0.1);
    const scaleScreen = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.03), matGreen);
    scaleScreen.position.set(-0.5, tableH + 0.08, -0.06);
    group.add(scaleBase, scaleScreen);

    // May in nhiet tem A6 de ban (Thermal Printer)
    const printerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.18), matWhite);
    printerMesh.position.set(0.55, tableH + 0.09, -0.1);
    const labelSlip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.01, 0.12), matWhite);
    labelSlip.position.set(0.55, tableH + 0.16, 0.02);
    group.add(printerMesh, labelSlip);

    // Sung miet bang dinh cam (Tape Dispenser Gun)
    const tapeGun = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.22), matOrange);
    tapeGun.position.set(0.15, tableH + 0.1, 0.15);
    group.add(tapeGun);

    return group;
  }

  /**
   * 4. Ke Chua Pallet Selective Rack 2 Tang
   * He khung thep chiu luc cong nghiep: Chan xanh Cobalt, Dam cam an toan
   */
  static createSelectiveRack(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'SelectiveRack';

    const bays = options.bays || 1;
    const bayW = 2.7;
    const rackDepth = 1.1;
    const rackH = 3.6;
    const tierH = 1.6;

    const matCol = getMaterial(PALETTE.fulldyCobalt, 0.3, 0.4);
    const matBeam = getMaterial(PALETTE.hazardOrange, 0.3, 0.3);

    // Chan cot thang dung (Upright Columns)
    const colGeo = new THREE.BoxGeometry(0.09, rackH, 0.09);
    for (let b = 0; b <= bays; b++) {
      const bx = -((bays * bayW) / 2) + b * bayW;
      [-rackDepth/2, rackDepth/2].forEach(cz => {
        const col = new THREE.Mesh(colGeo, matCol);
        col.position.set(bx, rackH / 2, cz);
        group.add(col);
      });

      // Gac giang cheo (Cross-bracings) ben hong cot
      const braceGeo = new THREE.CylinderGeometry(0.015, 0.015, rackDepth * 1.3, 4);
      braceGeo.rotateX(0.7);
      const brace = new THREE.Mesh(braceGeo, matCol);
      brace.position.set(bx, rackH / 2, 0);
      group.add(brace);
    }

    // Thanh dam chiu tai mau cam (Orange Load Beams) 2 tang
    const beamGeo = new THREE.BoxGeometry(bayW - 0.08, 0.12, 0.06);
    for (let b = 0; b < bays; b++) {
      const bx = -((bays * bayW) / 2) + b * bayW + bayW / 2;
      [0.2, 0.2 + tierH].forEach((ty, tierIdx) => {
        [-rackDepth/2 + 0.03, rackDepth/2 - 0.03].forEach(bz => {
          const beam = new THREE.Mesh(beamGeo, matBeam);
          beam.position.set(bx, ty, bz);
          group.add(beam);
        });

        // Dat 2 kien pallet hang len moi khoang tang
        [-bayW/4, bayW/4].forEach((px) => {
          const pallet = LowPolyWarehouseFactory.createEuroPalletCargo({ heightTiers: 2 + tierIdx });
          pallet.position.set(bx + px, ty + 0.06, 0);
          group.add(pallet);
        });
      });
    }

    return group;
  }

  /**
   * 5. Kien Pallet Go Dong Thung Quan Mang Co (Euro Pallet Cargo Stack)
   * Kich thuoc chuan EPAL: 1.2m x 0.8m x 1.4m tong the
   */
  static createEuroPalletCargo(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'PalletCargo';

    const matWood = getMaterial(PALETTE.woodPallet, 0.7, 0.0);
    const matBox = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);
    const matFilm = getMaterial(PALETTE.cleanWhite, 0.2, 0.1, true, 0.4);
    const matTape = getMaterial(PALETTE.fulldyCobalt, 0.3, 0.0);

    const pw = 0.8;
    const pl = 1.2;

    // Pallet go 3 nan day + 3 cuc chan + 5 nan mat
    const bottomSlatGeo = new THREE.BoxGeometry(pw, 0.022, 0.1);
    [-0.5, 0, 0.5].forEach(lz => {
      const slat = new THREE.Mesh(bottomSlatGeo, matWood);
      slat.position.set(0, 0.011, lz);
      group.add(slat);
    });

    const blockGeo = new THREE.BoxGeometry(0.12, 0.08, 0.12);
    [-0.3, 0, 0.3].forEach(bx => {
      [-0.5, 0, 0.5].forEach(bz => {
        const blk = new THREE.Mesh(blockGeo, matWood);
        blk.position.set(bx, 0.062, bz);
        group.add(blk);
      });
    });

    const topSlatGeo = new THREE.BoxGeometry(pw, 0.022, 0.14);
    [-0.5, -0.25, 0, 0.25, 0.5].forEach(lz => {
      const slat = new THREE.Mesh(topSlatGeo, matWood);
      slat.position.set(0, 0.113, lz);
      group.add(slat);
    });

    // Xep cac lop thung carton (Carton Layers)
    const tiers = options.heightTiers || 3;
    const boxH = 0.35;
    for (let t = 0; t < tiers; t++) {
      const cy = 0.124 + t * boxH + boxH / 2;
      const boxGeo = new THREE.BoxGeometry(pw * 0.95, boxH * 0.92, pl * 0.95);
      const box = new THREE.Mesh(boxGeo, matBox);
      box.position.set(0, cy, 0);
      group.add(box);
    }

    // Mang co PE bao ve trong suot
    const totalCargoH = tiers * boxH;
    const filmGeo = new THREE.BoxGeometry(pw + 0.02, totalCargoH + 0.02, pl + 0.02);
    const film = new THREE.Mesh(filmGeo, matFilm);
    film.position.set(0, 0.124 + totalCargoH / 2, 0);
    group.add(film);

    // Bang dinh niem phong Fulldy quanh than
    const tapeGeo = new THREE.BoxGeometry(pw + 0.025, 0.08, pl + 0.025);
    const tape = new THREE.Mesh(tapeGeo, matTape);
    tape.position.set(0, 0.124 + totalCargoH * 0.6, 0);
    group.add(tape);

    return group;
  }

  /**
   * 6. Cum Khay Nhua Tote Chia Hang (Stack of Totes)
   */
  static createToteStack(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'ToteStack';
    const count = options.count || 4;

    for (let i = 0; i < count; i++) {
      const color = i % 2 === 0 ? PALETTE.fulldyCobalt : PALETTE.cautionYellow;
      const tote = LowPolyWarehouseFactory.createSingleToteMesh(color);
      tote.position.set((i % 2) * 0.015, i * 0.16, 0);
      group.add(tote);
    }

    return group;
  }

  /**
   * 7. Xe Tai Giao Nhan Fulldy Logistics (Commercial Delivery Box Truck)
   * Kich thuoc: 5.5m dai, 2.2m rong, 2.7m cao
   */
  static createDeliveryTruck(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'DeliveryTruck';

    const matBlue = getMaterial(PALETTE.fulldyCobalt, 0.3, 0.3);
    const matWhite = getMaterial(PALETTE.cleanWhite, 0.4, 0.1);
    const matGlass = getMaterial(PALETTE.safetySky, 0.1, 0.8, true, 0.85);
    const matBlack = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);
    const matSteel = getMaterial(PALETTE.steelFrame, 0.3, 0.5);

    // Khung gam xe (Chassis)
    const chassisGeo = new THREE.BoxGeometry(1.9, 0.25, 5.2);
    const chassis = new THREE.Mesh(chassisGeo, matSteel);
    chassis.position.set(0, 0.45, 0);
    group.add(chassis);

    // Cabin lai xe mau xanh Fulldy
    const cabGeo = new THREE.BoxGeometry(2.0, 1.4, 1.6);
    const cab = new THREE.Mesh(cabGeo, matBlue);
    cab.position.set(0, 1.25, 1.7);
    group.add(cab);

    // Kinh chan gio phia truoc (Windshield)
    const glassGeo = new THREE.BoxGeometry(1.8, 0.6, 0.05);
    const glass = new THREE.Mesh(glassGeo, matGlass);
    glass.position.set(0, 1.45, 2.51);
    group.add(glass);

    // Thung kin cho hang mau trang (Cargo Box Container)
    const boxGeo = new THREE.BoxGeometry(2.1, 1.9, 3.4);
    const cargoBox = new THREE.Mesh(boxGeo, matWhite);
    cargoBox.position.set(0, 1.55, -0.85);
    group.add(cargoBox);

    // Soc nhan dien thuong hieu Fulldy mau xanh Cobalt chay doc suon
    const stripeGeo = new THREE.BoxGeometry(2.12, 0.35, 3.42);
    const stripe = new THREE.Mesh(stripeGeo, matBlue);
    stripe.position.set(0, 1.55, -0.85);
    group.add(stripe);

    // 6 Banh xe cao su
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
      [-1.0, 0.38,  1.7], // Truoc trai
      [ 1.0, 0.38,  1.7], // Truoc phai
      [-1.0, 0.38, -1.0], // Sau kep trai
      [ 1.0, 0.38, -1.0], // Sau kep phai
      [-1.0, 0.38, -1.7], // Sau kep trai
      [ 1.0, 0.38, -1.7]  // Sau kep phai
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, matBlack);
      wheel.position.set(wx, wy, wz);
      group.add(wheel);
    });

    return group;
  }

  /**
   * 8. Nhan Vien Nhat Hang Low-Poly (Picker Character)
   * Nhan vat ti le chibi / diorama cao 1.75m
   */
  static createWorkerPicker(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'WorkerPicker';

    const matPolo = getMaterial(PALETTE.fulldyCobalt, 0.7);
    const matVest = getMaterial(PALETTE.highVisVest, 0.5);
    const matPants = getMaterial(PALETTE.steelFrame, 0.8);
    const matBoots = getMaterial(PALETTE.rubberBlack, 0.8);
    const matSkin = getMaterial(PALETTE.skinTone, 0.5);
    const matHat = getMaterial(PALETTE.cautionYellow, 0.4);

    // 2 Chan quan & giay bao ho
    const legGeo = new THREE.BoxGeometry(0.14, 0.7, 0.14);
    const leftLeg = new THREE.Mesh(legGeo, matPants);
    leftLeg.position.set(-0.1, 0.35, 0);
    const rightLeg = new THREE.Mesh(legGeo, matPants);
    rightLeg.position.set(0.1, 0.35, 0);

    const bootGeo = new THREE.BoxGeometry(0.15, 0.12, 0.22);
    const leftBoot = new THREE.Mesh(bootGeo, matBoots);
    leftBoot.position.set(-0.1, 0.06, 0.03);
    const rightBoot = new THREE.Mesh(bootGeo, matBoots);
    rightBoot.position.set(0.1, 0.06, 0.03);
    group.add(leftLeg, rightLeg, leftBoot, rightBoot);

    // Than nguoi mac ao polo xanh
    const torsoGeo = new THREE.BoxGeometry(0.38, 0.52, 0.24);
    const torso = new THREE.Mesh(torsoGeo, matPolo);
    torso.position.set(0, 0.95, 0);

    // Ao gile phan quang ben ngoai
    const vestGeo = new THREE.BoxGeometry(0.40, 0.46, 0.26);
    const vest = new THREE.Mesh(vestGeo, matVest);
    vest.position.set(0, 0.95, 0);
    group.add(torso, vest);

    // Dau & non bao ho
    const headGeo = new THREE.BoxGeometry(0.22, 0.24, 0.22);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.position.set(0, 1.34, 0);

    const hatGeo = new THREE.BoxGeometry(0.26, 0.10, 0.28);
    const hat = new THREE.Mesh(hatGeo, matHat);
    hat.position.set(0, 1.46, 0);
    group.add(head, hat);

    // 2 Tay dua ve phia truoc (tu the day xe)
    const armGeo = new THREE.BoxGeometry(0.1, 0.48, 0.1);
    const leftArm = new THREE.Mesh(armGeo, matPolo);
    leftArm.position.set(-0.24, 0.95, 0.12);
    leftArm.rotation.x = -0.6;
    const rightArm = new THREE.Mesh(armGeo, matPolo);
    rightArm.position.set(0.24, 0.95, 0.12);
    rightArm.rotation.x = -0.6;
    group.add(leftArm, rightArm);

    return group;
  }

  /**
   * 9. Giam Sat Dieu Phoi Sàn Kho (Floor Supervisor)
   */
  static createFloorSupervisor(options = {}) {
    const group = LowPolyWarehouseFactory.createWorkerPicker({ ...options, name: 'FloorSupervisor' });

    // Thay non bao ho mau trang (White Hard Hat danh cho chi huy)
    const matWhite = getMaterial(PALETTE.cleanWhite, 0.3);
    const whiteHat = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.10, 0.28), matWhite);
    whiteHat.position.set(0, 1.46, 0);
    group.add(whiteHat);

    // Bo dam Motorola tren cau vai
    const radioMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.05), getMaterial(PALETTE.rubberBlack));
    radioMesh.position.set(-0.18, 1.15, 0.06);
    const antennaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 4), getMaterial(PALETTE.steelFrame));
    antennaMesh.position.set(-0.18, 1.25, 0.06);
    group.add(radioMesh, antennaMesh);

    // Bang kep danh sach kiem ke tren tay
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.02), matWhite);
    board.position.set(0.15, 0.9, 0.22);
    board.rotation.x = -0.5;
    group.add(board);

    return group;
  }

  /**
   * 10. Cong Tiep Nhan Inbound Dock & San Boc Do (Dock Bay)
   */
  static createInboundDockBay(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'InboundDockBay';

    const matWall = getMaterial(PALETTE.steelLight, 0.6);
    const matShutter = getMaterial(PALETTE.steelBeam, 0.5, 0.4);
    const matFloor = getMaterial(PALETTE.steelFrame, 0.8);
    const matRubber = getMaterial(PALETTE.rubberBlack, 0.9);
    const matStripe = getMaterial(PALETTE.hazardAmber, 0.5);

    const doorW = 3.2;
    const doorH = 3.4;

    // Tuong be tong bao quanh cong
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 0.3), matWall);
    wallLeft.position.set(-doorW/2 - 0.3, 2.1, 0);
    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4.2, 0.3), matWall);
    wallRight.position.set(doorW/2 + 0.3, 2.1, 0);
    const wallTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 1.2, 0.8, 0.3), matWall);
    wallTop.position.set(0, doorH + 0.4, 0);
    group.add(wallLeft, wallRight, wallTop);

    // Cua cuon thep co keo mo 60%
    const shutterH = doorH * 0.45;
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.05, shutterH, 0.08), matShutter);
    shutter.position.set(0, doorH - shutterH / 2, 0);
    group.add(shutter);

    // 2 Dem cao su giam chan duoi xe tai (Dock Bumpers)
    const bumperGeo = new THREE.BoxGeometry(0.24, 0.55, 0.22);
    const leftBumper = new THREE.Mesh(bumperGeo, matRubber);
    leftBumper.position.set(-doorW/2 + 0.15, 0.3, 0.2);
    const rightBumper = new THREE.Mesh(bumperGeo, matRubber);
    rightBumper.position.set(doorW/2 - 0.15, 0.3, 0.2);
    group.add(leftBumper, rightBumper);

    // San be tong dem va vach soc vang den an toan
    const apronGeo = new THREE.BoxGeometry(doorW + 1.2, 0.05, 2.5);
    const apron = new THREE.Mesh(apronGeo, matFloor);
    apron.position.set(0, 0.025, 1.25);

    const stripeEdge = new THREE.Mesh(new THREE.BoxGeometry(doorW + 1.2, 0.06, 0.25), matStripe);
    stripeEdge.position.set(0, 0.03, 2.4);
    group.add(apron, stripeEdge);

    return group;
  }
}
