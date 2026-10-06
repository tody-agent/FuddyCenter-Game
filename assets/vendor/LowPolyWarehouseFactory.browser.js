/**
 * LowPolyWarehouseFactory Browser Bundle
 * Procedural Low-Poly 3D Models for Three.js
 */
(function (root, factory) {
  var theThree = typeof THREE !== 'undefined' ? THREE : (typeof root !== 'undefined' && root.THREE ? root.THREE : null);
  if (!theThree && typeof require === 'function') {
    try { theThree = require('three'); } catch (e) {}
  }
  var exp = factory(theThree);
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = exp;
  }
  if (typeof root !== 'undefined') {
    root.PALETTE = exp.PALETTE;
    root.LowPolyWarehouseFactory = exp.LowPolyWarehouseFactory;
  }
  if (typeof window !== 'undefined') {
    window.PALETTE = exp.PALETTE;
    window.LowPolyWarehouseFactory = exp.LowPolyWarehouseFactory;
  }
}(typeof self !== 'undefined' ? self : this, function (THREE) {

/**
 * LowPolyWarehouseFactory: Bo tao hinh 3D khoi Low-Poly / Chunky Isometric chuyen dung cho Fulldy Center
 * 
 * Thiet ke theo triet ly Toy-like / Diorama Tycoon (Factorio, Two Point Hospital):
 * - Kich thuoc theo he met thuc te (1 don vi Three.js = 1 met)
 * - Diem neo Pivot Point luon nam tren mat san (y = 0)
 * - Palette mau nhan dien thuong hieu Fulldy (Cobalt Blue, Hazard Amber, Safety Sky)
 * - Khong su dung file 3D ben ngoai (tu dung procedural 100% tu BoxGeometry, CylinderGeometry)
 */

const PALETTE = {
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
  skinTone: 0xfbcfe8,
  fireRed: 0xb91c1c,
  treeGreen: 0x15803d,
  treeDark: 0x166534
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

class LowPolyWarehouseFactory {

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

  /**
   * 11. Sa Bàn Kho Khởi Nghiệp Toàn Cảnh (Starter Warehouse Diorama)
   * Tích hợp đồng bộ 2 dãy kệ Selective, bàn đóng gói, xe tải dock, xe kéo tay, xe đẩy và nhân sự
   */
  static createStarterWarehouseDiorama(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'StarterWarehouseDiorama';

    // 1. Sàn bê tông kho (Floor Base)
    const floorSize = 16;
    const floorGeo = new THREE.BoxGeometry(floorSize, 0.2, floorSize);
    const floorMesh = new THREE.Mesh(floorGeo, getMaterial(PALETTE.concreteFloor, 0.9));
    floorMesh.position.set(0, -0.1, 0);
    group.add(floorMesh);

    // Vạch phân luồng vàng an toàn (Safety Yellow Walkway)
    const lineGeo = new THREE.BoxGeometry(0.12, 0.01, floorSize - 2);
    const matLine = getMaterial(PALETTE.hazardAmber, 0.4);
    const lineL = new THREE.Mesh(lineGeo, matLine);
    lineL.position.set(-2.5, 0.01, 0);
    const lineR = new THREE.Mesh(lineGeo, matLine);
    lineR.position.set(2.5, 0.01, 0);
    group.add(lineL, lineR);

    // 2. Hai dãy kệ pallet Selective Rack
    const rack1 = LowPolyWarehouseFactory.createSelectiveRack({ bays: 2 });
    rack1.position.set(-4.5, 0, -2);
    const rack2 = LowPolyWarehouseFactory.createSelectiveRack({ bays: 2 });
    rack2.position.set(-4.5, 0, 3);
    group.add(rack1, rack2);

    // 3. Bàn đóng gói thủ công KCS
    const packTable = LowPolyWarehouseFactory.createConventionalPackTable();
    packTable.position.set(4.5, 0, -2);
    packTable.rotation.y = -Math.PI / 2;
    group.add(packTable);

    // 4. Cổng tiếp nhận Inbound Dock và xe tải
    const dock = LowPolyWarehouseFactory.createInboundDockBay();
    dock.position.set(0, 0, -floorSize / 2 + 0.2);
    group.add(dock);

    const truck = LowPolyWarehouseFactory.createDeliveryTruck();
    truck.position.set(0, 0, -floorSize / 2 - 3.8);
    group.add(truck);

    // 5. Xe kéo tay pallet jack
    const jack = LowPolyWarehouseFactory.createHandPalletJack();
    jack.position.set(-1, 0, -4);
    jack.rotation.y = 0.5;
    group.add(jack);

    // 6. Xe đẩy gom hàng kèm khay tote
    const cart = LowPolyWarehouseFactory.createPickingCart();
    cart.position.set(1.5, 0, 1.5);
    cart.rotation.y = -0.6;
    group.add(cart);

    // 7. Công nhân nhặt hàng (Picker)
    const picker = LowPolyWarehouseFactory.createWorkerPicker();
    picker.position.set(1.5, 0, 0.5);
    picker.rotation.y = Math.PI;
    group.add(picker);

    // 8. Giám sát viên sàn kho (Supervisor)
    const supervisor = LowPolyWarehouseFactory.createFloorSupervisor();
    supervisor.position.set(3.5, 0, -1);
    supervisor.rotation.y = -1.2;
    group.add(supervisor);

    // 9. Cụm khay tote và kiện pallet sẵn sàng
    const toteStack = LowPolyWarehouseFactory.createToteStack({ tiers: 4 });
    toteStack.position.set(4.5, 0, 2);
    const stagedPallet = LowPolyWarehouseFactory.createEuroPalletCargo({ heightTiers: 3 });
    stagedPallet.position.set(0, 0, 4);
    group.add(toteStack, stagedPallet);

    return group;
  }

  // Alias methods for convenience
  static createPackTable(options = {}) {
    return LowPolyWarehouseFactory.createConventionalPackTable(options);
  }

  static createInboundDock(options = {}) {
    return LowPolyWarehouseFactory.createInboundDockBay(options);
  }

  static createStackOfTotes(options = {}) {
    return LowPolyWarehouseFactory.createToteStack(options);
  }

  /**
   * 12. Xe Nâng Điện Ngồi Lái (Industrial Electric Forklift - FL-12)
   * Trích xuất từ cấu trúc 3D gốc của boxme-mission-control.html
   * Kích thước: 2.6m dài, 1.2m rộng, 2.42m cao
   */
  static createIndustrialForklift(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'IndustrialForklift';

    const matWhite = getMaterial(PALETTE.cleanWhite, 0.4, 0.1);
    const matSteel = getMaterial(PALETTE.steelBeam, 0.3, 0.5);
    const matDark = getMaterial(PALETTE.steelFrame, 0.3, 0.5);
    const matCobalt = getMaterial(PALETTE.fulldyCobalt, 0.4, 0.2);
    const matBlack = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);
    const matWood = getMaterial(PALETTE.woodPallet, 0.7, 0.0);
    const matBox = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);

    // 1. Thân xe và khối đối trọng (Chassis & Counterweight)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 1.7), matWhite);
    body.position.set(0, 0.5, 0.25);
    const counterweight = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.55), matSteel);
    counterweight.position.set(0, 0.6, -0.45);
    group.add(body, counterweight);

    // 2. Ghế ngồi lái và bảng điều khiển
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), matCobalt);
    seat.position.set(0, 0.85, -0.05);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), matCobalt);
    seatBack.position.set(0, 1.15, -0.3);
    const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.2), matDark);
    consoleBox.position.set(0.2, 0.95, 0.45);
    group.add(seat, seatBack, consoleBox);

    // 3. Khung bảo vệ cabin trên cao (Roll Cage Guard)
    const cagePosts = [[-0.48, -0.35], [0.48, -0.35], [-0.48, 0.6], [0.48, 0.6]];
    cagePosts.forEach(([cx, cz]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.35, 0.05), matDark);
      post.position.set(cx, 1.45, cz);
      group.add(post);
    });
    const cageTop = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.05, 1.05), matDark);
    cageTop.position.set(0, 2.15, 0.12);
    group.add(cageTop);

    // 4. Bánh xe cao su (2 bánh tải trước + 2 bánh lái sau)
    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 10);
    wheelGeo.rotateZ(Math.PI / 2);
    const frontL = new THREE.Mesh(wheelGeo, matBlack);
    frontL.position.set(-0.55, 0.28, 0.75);
    const frontR = new THREE.Mesh(wheelGeo, matBlack);
    frontR.position.set(0.55, 0.28, 0.75);
    const rearWheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 8);
    rearWheelGeo.rotateZ(Math.PI / 2);
    const rearL = new THREE.Mesh(rearWheelGeo, matBlack);
    rearL.position.set(-0.48, 0.22, -0.35);
    const rearR = new THREE.Mesh(rearWheelGeo, matBlack);
    rearR.position.set(0.48, 0.22, -0.35);
    group.add(frontL, frontR, rearL, rearR);

    // 5. Cột nâng thẳng đứng (Vertical Mast)
    const mastColGeo = new THREE.BoxGeometry(0.08, 2.4, 0.1);
    const mastL = new THREE.Mesh(mastColGeo, matSteel);
    mastL.position.set(0.32, 1.25, 1.08);
    const mastR = new THREE.Mesh(mastColGeo, matSteel);
    mastR.position.set(-0.32, 1.25, 1.08);
    const mastTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.1), matSteel);
    mastTop.position.set(0, 2.42, 1.08);
    group.add(mastL, mastR, mastTop);

    // 6. Giá đỡ và 2 càng nâng thép (Forks)
    const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.06), matDark);
    carriage.position.set(0, 0.35, 1.15);
    const forkGeo = new THREE.BoxGeometry(0.1, 0.04, 1.05);
    const forkL = new THREE.Mesh(forkGeo, matDark);
    forkL.position.set(-0.22, 0.15, 1.7);
    const forkR = new THREE.Mesh(forkGeo, matDark);
    forkR.position.set(0.22, 0.15, 1.7);
    group.add(carriage, forkL, forkR);

    // 7. Kiện pallet hàng đặt trên càng (Euro Pallet Cargo Load)
    const palletBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 1.2), matWood);
    palletBase.position.set(0, 0.2, 1.7);
    group.add(palletBase);

    for (let i = 0; i < 8; i++) {
      const bx = (i & 1) ? 0.24 : -0.24;
      const by = 0.38 + ((i >> 2) & 1) * 0.45;
      const bz = 1.7 + ((i & 2) ? 0.27 : -0.27);
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.44), matBox);
      box.position.set(bx, by, bz);
      group.add(box);
    }

    return group;
  }

  /**
   * 13. Băng Chuyền Băng Tải Con Lăn (Conveyor Belt Line)
   * Trích xuất từ cấu trúc module fp() của boxme-mission-control.html
   * Kích thước: 3.0m dài, 0.85m rộng, 0.75m cao
   */
  static createConveyorSegment(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'ConveyorSegment';

    const len = options.length || 3.0;
    const matRail = getMaterial(PALETTE.steelBeam, 0.3, 0.5);
    const matLeg = getMaterial(PALETTE.steelLight, 0.3, 0.6);
    const matBelt = getMaterial(PALETTE.rubberBlack, 0.7, 0.1);
    const matBox = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);

    // 2 Thanh ray dẫn hướng song song (Guide Rails)
    const railGeo = new THREE.BoxGeometry(0.06, 0.15, len);
    const railL = new THREE.Mesh(railGeo, matRail);
    railL.position.set(-0.4, 0.68, 0);
    const railR = new THREE.Mesh(railGeo, matRail);
    railR.position.set(0.4, 0.68, 0);
    group.add(railL, railR);

    // Mặt băng tải (Conveyor Belt Bed)
    const beltGeo = new THREE.BoxGeometry(0.75, 0.04, len);
    const belt = new THREE.Mesh(beltGeo, matBelt);
    belt.position.set(0, 0.72, 0);
    group.add(belt);

    // Chân đế thép cách đều 1.5m (H-Frame Legs)
    const legGeo = new THREE.BoxGeometry(0.06, 0.7, 0.06);
    const legCrossGeo = new THREE.BoxGeometry(0.74, 0.05, 0.05);
    const legZs = [-len / 2 + 0.2, 0, len / 2 - 0.2];
    legZs.forEach(lz => {
      const leg1 = new THREE.Mesh(legGeo, matLeg);
      leg1.position.set(-0.38, 0.35, lz);
      const leg2 = new THREE.Mesh(legGeo, matLeg);
      leg2.position.set(0.38, 0.35, lz);
      const cross = new THREE.Mesh(legCrossGeo, matLeg);
      cross.position.set(0, 0.25, lz);
      group.add(leg1, leg2, cross);
    });

    // 2 Kiện thùng hàng đang chạy trên băng chuyền
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.5), matBox);
    box1.position.set(0, 0.89, -0.6);
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.35), matBox);
    box2.position.set(0.05, 0.865, 0.7);
    group.add(box1, box2);

    return group;
  }

  /**
   * 14. Bàn Đóng Gói Kèm Đèn Tín Hiệu Andon (Pack Station with Andon Lamp)
   * Trích xuất từ module lp() của boxme-mission-control.html
   * Kích thước: 1.4m dài, 0.8m rộng, 1.75m cao (cột đèn)
   */
  static createPackStationWithAndon(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'PackStationAndon';

    const matTop = getMaterial(PALETTE.cleanWhite, 0.4, 0.1);
    const matLeg = getMaterial(PALETTE.steelLight, 0.3, 0.5);
    const matDark = getMaterial(PALETTE.steelFrame, 0.4, 0.4);
    const matGreen = getMaterial(PALETTE.slaNominal, 0.2, 0.1);

    // Mặt bàn composite trắng
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.8), matTop);
    top.position.set(0, 0.84, 0);
    group.add(top);

    // 4 Chân bàn thép ống
    const legGeo = new THREE.BoxGeometry(0.06, 0.84, 0.06);
    [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, matLeg);
      leg.position.set(lx, 0.42, lz);
      group.add(leg);
    });

    // Màn hình máy tính KCS thao tác
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.05), matDark);
    screen.position.set(0.4, 1.05, -0.3);
    const screenStand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.06), matDark);
    screenStand.position.set(0.4, 0.94, -0.3);
    group.add(screen, screenStand);

    // Máy in tem và máy đọc mã vạch
    const printer = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.2), matLeg);
    printer.position.set(-0.4, 0.91, 0.1);
    group.add(printer);

    // Cột đèn tháp tín hiệu Andon (Andon Lamp Mast)
    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.6, 6);
    const pole = new THREE.Mesh(poleGeo, matLeg);
    pole.position.set(0, 1.0, -0.38);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), matGreen);
    lamp.position.set(0, 1.75, -0.38);
    group.add(pole, lamp);

    return group;
  }

  /**
   * 15. Kệ Pallet Selective 3 Tầng Siêu Tải (3-Tier Heavy Duty Pallet Rack)
   * Trích xuất từ module op() của boxme-mission-control.html
   * Kích thước: 2.7m dài, 1.1m rộng, 4.2m cao
   */
  static createSelectiveRack3Tier(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'SelectiveRack3Tier';

    const matCol = getMaterial(PALETTE.fulldyCobalt, 0.3, 0.4);
    const matBeam = getMaterial(PALETTE.hazardOrange, 0.3, 0.4);
    const matSilver = getMaterial(PALETTE.steelLight, 0.4, 0.5);

    // 4 Chân cột thép chịu lực cao 4.2m
    const colGeo = new THREE.BoxGeometry(0.08, 4.2, 0.08);
    [[-1.25, -0.45], [1.25, -0.45], [-1.25, 0.45], [1.25, 0.45]].forEach(([cx, cz]) => {
      const col = new THREE.Mesh(colGeo, matCol);
      col.position.set(cx, 2.1, cz);
      group.add(col);
    });

    // 3 Tầng dầm ngang và giằng ngang đỡ pallet
    const beamGeo = new THREE.BoxGeometry(2.58, 0.1, 0.12);
    const crossGeo = new THREE.BoxGeometry(0.12, 0.08, 1.0);
    const tierYs = [0.25, 1.6, 2.95];

    tierYs.forEach((ty, tierIdx) => {
      [-0.45, 0.45].forEach(bz => {
        const beam = new THREE.Mesh(beamGeo, matBeam);
        beam.position.set(0, ty, bz);
        group.add(beam);
      });
      [-1.25, 1.25].forEach(cx => {
        const cross = new THREE.Mesh(crossGeo, matSilver);
        cross.position.set(cx, ty, 0);
        group.add(cross);
      });

      // 2 Kiện pallet đầy hàng trên mỗi tầng
      [-0.65, 0.65].forEach(px => {
        const pallet = LowPolyWarehouseFactory.createEuroPalletCargo({ heightTiers: 2 + (tierIdx % 2) });
        pallet.position.set(px, ty + 0.05, 0);
        group.add(pallet);
      });
    });

    return group;
  }

  /**
   * 16. Kệ Chia Hàng Ô Bồ Câu 4 Tầng (Sorting Pigeonhole Flow Rack)
   * Trích xuất từ module ap() / ip() của boxme-mission-control.html
   * Kích thước: 1.8m dài, 0.6m rộng, 1.85m cao
   */
  static createSortingFlowRack(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'SortingFlowRack';

    const matFrame = getMaterial(PALETTE.steelFrame, 0.4, 0.4);
    const matShelf = getMaterial(PALETTE.steelLight, 0.3, 0.5);
    const matToteBlue = getMaterial(PALETTE.fulldyCobalt, 0.5, 0.0);
    const matToteYellow = getMaterial(PALETTE.cautionYellow, 0.5, 0.0);

    // 4 Cột thép khung
    const postGeo = new THREE.BoxGeometry(0.05, 1.85, 0.05);
    [[-0.88, -0.27], [0.88, -0.27], [-0.88, 0.27], [0.88, 0.27]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, matFrame);
      post.position.set(px, 0.925, pz);
      group.add(post);
    });

    // 4 Tầng máng chia ô phân loại đơn hàng
    const shelfGeo = new THREE.BoxGeometry(1.8, 0.04, 0.55);
    const tierYs = [0.4, 0.85, 1.3, 1.75];
    tierYs.forEach((ty, tIdx) => {
      const shelf = new THREE.Mesh(shelfGeo, matShelf);
      shelf.position.set(0, ty, 0);
      shelf.rotation.x = 0.08;
      group.add(shelf);

      // Các khay đơn hàng ô bồ câu trên mỗi tầng
      for (let s = -2; s <= 2; s++) {
        const toteMat = (s + tIdx) % 2 === 0 ? matToteBlue : matToteYellow;
        const tote = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.4), toteMat);
        tote.position.set(s * 0.34, ty + 0.12, 0);
        group.add(tote);
      }
    });

    return group;
  }

  /**
   * 17. Xe Đẩy Chia Chọn Hàng Lưới Thép (Mobile Staging Cart with Mesh Sides)
   * Trích xuất từ module dp() của boxme-mission-control.html
   * Kích thước: 1.2m dài, 1.0m rộng, 1.85m cao
   */
  static createMobileStagingCart(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'MobileStagingCart';

    const matSteel = getMaterial(PALETTE.steelBeam, 0.3, 0.5);
    const matBlack = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);
    const matBox = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);

    // 4 Trụ thép ống
    const postGeo = new THREE.BoxGeometry(0.05, 1.8, 0.05);
    [[-0.55, -0.45], [0.55, -0.45], [-0.55, 0.45], [0.55, 0.45]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, matSteel);
      post.position.set(px, 0.95, pz);
      group.add(post);
    });

    // 3 Mặt sàn thép (đáy, giữa, nóc)
    const deckGeo = new THREE.BoxGeometry(1.2, 0.05, 1.0);
    [0.1, 0.9, 1.75].forEach(dy => {
      const deck = new THREE.Mesh(deckGeo, matSteel);
      deck.position.set(0, dy, 0);
      group.add(deck);
    });

    // Lưới thép hai bên hông
    for (let h = 0.2; h <= 1.7; h += 0.25) {
      const barGeo = new THREE.BoxGeometry(0.02, 0.02, 0.95);
      [-0.56, 0.56].forEach(bx => {
        const bar = new THREE.Mesh(barGeo, matSteel);
        bar.position.set(bx, h, 0);
        group.add(bar);
      });
    }

    // 4 Bánh xe cao su chịu tải xoay 360 độ
    const wheelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 8);
    wheelGeo.rotateZ(Math.PI / 2);
    [[-0.55, -0.45], [0.55, -0.45], [-0.55, 0.45], [0.55, 0.45]].forEach(([wx, wz]) => {
      const w = new THREE.Mesh(wheelGeo, matBlack);
      w.position.set(wx, 0.05, wz);
      group.add(w);
    });

    // Thùng hàng trên sàn xe
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.4), matBox);
    b1.position.set(-0.25, 0.3, 0);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.35), matBox);
    b2.position.set(0.25, 0.28, 0);
    group.add(b1, b2);

    return group;
  }

  /**
   * 18. Trạm Gác Bảo Vệ Kèm Cần Barrier Tự Động (Security Guardhouse & Barrier)
   * Trích xuất từ module Zf() của boxme-mission-control.html
   * Kích thước: 3.5m dài, 2.5m rộng, 2.8m cao
   */
  static createGuardhouseBarrier(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'GuardhouseBarrier';

    const matWall = getMaterial(PALETTE.cleanWhite, 0.5, 0.0);
    const matRoof = getMaterial(PALETTE.fulldyCobalt, 0.4, 0.2);
    const matWindow = getMaterial(PALETTE.safetySky, 0.1, 0.8, true, 0.7);
    const matBase = getMaterial(PALETTE.steelFrame, 0.4, 0.4);
    const matYellow = getMaterial(PALETTE.cautionYellow, 0.4, 0.0);
    const matDark = getMaterial(PALETTE.rubberBlack, 0.8, 0.1);

    // Nhà gác bảo vệ (Booth)
    const booth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.0), matWall);
    booth.position.set(0, 1.2, 0);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.25, 2.3), matRoof);
    roof.position.set(0, 2.45, 0);
    const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.05), matWindow);
    windowGlass.position.set(0, 1.25, 1.01);
    group.add(booth, roof, windowGlass);

    // Trụ barrier motor
    const barrierBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), matBase);
    barrierBase.position.set(-1.8, 0.5, 0.8);
    group.add(barrierBase);

    // Cần barrier sọc vàng đen chắn cổng
    const armLen = 3.2;
    for (let s = 0; s < 8; s++) {
      const segMat = s % 2 === 0 ? matYellow : matDark;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(armLen / 8, 0.1, 0.05), segMat);
      seg.position.set(-1.8 + (s + 0.5) * (armLen / 8), 0.95, 0.8);
      group.add(seg);
    }

    return group;
  }

  /**
   * 19. Cột Đèn Chiếu Sáng Sàn Kho 7.6m (High-Bay Yard Street Light)
   * Trích xuất từ module ep() của boxme-mission-control.html
   * Kích thước: 7.6m cao, cần vươn 1.6m
   */
  static createHighBayStreetLight(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'HighBayStreetLight';

    const matPole = getMaterial(PALETTE.steelLight, 0.3, 0.6);
    const matFixture = getMaterial(PALETTE.steelFrame, 0.4, 0.4);
    const matLed = getMaterial(PALETTE.cleanWhite, 0.1, 0.0);

    // Cột thép vươn cao 7.6m
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.14, 7.6, 8);
    const pole = new THREE.Mesh(poleGeo, matPole);
    pole.position.set(0, 3.8, 0);
    group.add(pole);

    // Cần ngang vươn đèn
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.6), matPole);
    arm.position.set(0, 7.45, 0.75);
    group.add(arm);

    // Hộp đèn chiếu sáng LED công nghiệp
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.7), matFixture);
    fixture.position.set(0, 7.38, 1.45);
    const ledPanel = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.56), matLed);
    ledPanel.position.set(0, 7.32, 1.45);
    group.add(fixture, ledPanel);

    // Đế bê tông móng cột
    const baseGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.3, 8);
    const base = new THREE.Mesh(baseGeo, getMaterial(PALETTE.concreteFloor, 0.8));
    base.position.set(0, 0.15, 0);
    group.add(base);

    return group;
  }

  /**
   * 20. Trụ Cứu Hỏa & Hệ Thống PCCC Sàn Kho (Fire Safety Hydrant & Pipeline)
   * Trích xuất từ module D() của boxme-mission-control.html
   * Kích thước: 1.2m cao, 0.7m rộng
   */
  static createFireSafetyHydrant(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'FireSafetyHydrant';

    const matRed = getMaterial(PALETTE.fireRed, 0.3, 0.4);
    const matCap = getMaterial(PALETTE.steelFrame, 0.3, 0.5);
    const matBase = getMaterial(PALETTE.concreteFloor, 0.8);

    // Bệ móng bê tông
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), matBase);
    pad.position.set(0, 0.06, 0);
    group.add(pad);

    // Trụ nước chữa cháy thân đứng
    const standpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.95, 8), matRed);
    standpipe.position.set(0, 0.58, 0);
    group.add(standpipe);

    // Nắp đậy van xả chính trên đỉnh
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 8), matCap);
    topCap.position.set(0, 1.08, 0);
    group.add(topCap);

    // 2 Họng xả nước hai bên (Dual Discharge Outlets)
    const outletGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.22, 8);
    outletGeo.rotateZ(Math.PI / 2);
    const outletL = new THREE.Mesh(outletGeo, matRed);
    outletL.position.set(-0.16, 0.72, 0);
    const outletR = new THREE.Mesh(outletGeo, matRed);
    outletR.position.set(0.16, 0.72, 0);
    const capL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 8), matCap);
    capL.rotation.z = Math.PI / 2;
    capL.position.set(-0.28, 0.72, 0);
    const capR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 8), matCap);
    capR.rotation.z = Math.PI / 2;
    capR.position.set(0.28, 0.72, 0);
    group.add(outletL, outletR, capL, capR);

    return group;
  }

  /**
   * 21. Thùng Rác Phân Loại Vật Liệu Đóng Gói (Industrial Waste & Recycling Bin)
   * Trích xuất từ module pp() của boxme-mission-control.html
   * Kích thước: 0.6m x 0.6m x 0.85m
   */
  static createIndustrialTrashBin(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'IndustrialTrashBin';

    const matBase = getMaterial(PALETTE.steelFrame, 0.5, 0.3);
    const matBody = getMaterial(PALETTE.steelBeam, 0.4, 0.2);
    const matLid = getMaterial(PALETTE.cleanWhite, 0.3, 0.1);

    // Đế chân thùng
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.45), matBase);
    base.position.set(0, 0.04, 0);
    group.add(base);

    // Thân thùng thép chứa rác
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 0.4), matBody);
    body.position.set(0, 0.4, 0);
    group.add(body);

    // Nắp lật có khe bỏ rác
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.44), matLid);
    lid.position.set(0, 0.78, 0);
    group.add(lid);

    return group;
  }

  /**
   * 22. Kiện Hàng Pallet Xếp Sẵn Đệm Sàn (Buffer Pallet Stack)
   * Trích xuất từ module pp() của boxme-mission-control.html
   * Kích thước: 1.2m x 1.0m x 0.95m
   */
  static createBufferPalletStack(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'BufferPalletStack';

    const matWood = getMaterial(PALETTE.woodPallet, 0.7, 0.0);
    const matBox = getMaterial(PALETTE.cardboardKraft, 0.6, 0.0);

    // Pallet gỗ EPAL
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.0), matWood);
    pallet.position.set(0, 0.06, 0);
    group.add(pallet);

    // 2 Tầng thùng carton chờ bốc dỡ
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.8), matBox);
    b1.position.set(0, 0.3, 0);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.8), matBox);
    b2.position.set(0, 0.66, 0);
    group.add(b1, b2);

    return group;
  }

  /**
   * 23. Cây Xanh Cách Ly Quy Hoạch Sân Kho (Landscaping Green Tree)
   * Trích xuất từ module $f() của boxme-mission-control.html
   * Kích thước: 3.5m cao, tán lá 1.8m
   */
  static createLandscapeTree(options = {}) {
    const group = new THREE.Group();
    group.name = options.name || 'LandscapeTree';

    const matTrunk = getMaterial(PALETTE.cardboardDark, 0.8, 0.0);
    const matRing = getMaterial(PALETTE.cleanWhite, 0.6, 0.0);
    const matFoliage1 = getMaterial(PALETTE.treeGreen, 0.8, 0.0);
    const matFoliage2 = getMaterial(PALETTE.treeDark, 0.8, 0.0);

    // Vòng bồn cây bê tông
    const ringGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.2, 8);
    const ring = new THREE.Mesh(ringGeo, matRing);
    ring.position.set(0, 0.1, 0);
    group.add(ring);

    // Thân cây gỗ
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.4, 6);
    const trunk = new THREE.Mesh(trunkGeo, matTrunk);
    trunk.position.set(0, 0.8, 0);
    group.add(trunk);

    // Tán lá hình học Low-Poly 2 tầng
    const canopy1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 1.2, 1.2, 7), matFoliage1);
    canopy1.position.set(0, 2.0, 0);
    const canopy2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.85, 1.0, 6), matFoliage2);
    canopy2.position.set(0, 2.8, 0);
    group.add(canopy1, canopy2);

    return group;
  }
}

  return {
    PALETTE: PALETTE,
    LowPolyWarehouseFactory: LowPolyWarehouseFactory
  };
}));
