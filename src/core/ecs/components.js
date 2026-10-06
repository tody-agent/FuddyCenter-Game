/**
 * Định nghĩa các bitECS Components theo định dạng TypedArray (SoA - Structure of Arrays)
 * Chuẩn bitECS 0.4.0: Zero GC allocations trong suốt vòng lặp mô phỏng
 */
export const Position = {
  x: new Float32Array(10000),
  y: new Float32Array(10000),
  z: new Float32Array(10000)
};

export const Velocity = {
  vx: new Float32Array(10000),
  vy: new Float32Array(10000),
  vz: new Float32Array(10000)
};

export const Parcel = {
  status: new Uint8Array(10000), // 0: Inbound, 1: Slotted, 2: Picking, 3: IS_Buffer, 4: Packed, 5: Dispatched
  targetStation: new Uint16Array(10000),
  weightGrams: new Uint32Array(10000)
};

export const ConveyorCarrier = {
  speed: new Float32Array(10000),
  conveyorId: new Uint16Array(10000)
};

export const Worker = {
  role: new Uint8Array(10000), // 0: Core Picker, 1: Temp Picker, 2: Packer, 3: VAS Specialist
  stamina: new Float32Array(10000), // 0.0 - 100.0%
  speed: new Float32Array(10000)
};
