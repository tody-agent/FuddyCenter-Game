import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RenderBridge } from '../gfx/RenderBridge.js';
import { ProceduralAudioEngine } from '../audio/ProceduralAudioEngine.js';

describe('RenderBridge & ProceduralAudioEngine Tests', () => {
  test('RenderBridge should interpolate entity positions smoothly between ticks', () => {
    const bridge = new RenderBridge();
    const eid = 42;

    // Tick 0: Entity at (0, 0, 0)
    bridge.recordState(eid, { x: 0, y: 0, z: 0 });
    // Tick 1: Entity at (10, 0, 0)
    bridge.recordState(eid, { x: 10, y: 0, z: 0 });

    // Interpolate at alpha = 0.5 (halfway between frames)
    const interpHalf = bridge.getInterpolatedPosition(eid, 0.5);
    assert.equal(interpHalf.x, 5.0, 'Position X at alpha 0.5 should be exactly 5.0');

    // Interpolate at alpha = 0.8
    const interp80 = bridge.getInterpolatedPosition(eid, 0.8);
    assert.equal(interp80.x, 8.0, 'Position X at alpha 0.8 should be exactly 8.0');
  });

  test('ProceduralAudioEngine should synthesize warehouse audio effects without external dependencies', () => {
    const audio = new ProceduralAudioEngine({ headless: true });

    // Verify synthesizer method signatures and safe headless execution
    assert.doesNotThrow(() => {
      audio.playBarcodeScan();
      audio.playForkliftReverse();
      audio.playSlaAlarm();
    });
    assert.equal(audio.headless, true);
  });
});
