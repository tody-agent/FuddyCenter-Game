import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationEventBus } from '../core/events/EventBus.js';
import { CircuitBreakerSystem } from '../core/systems/CircuitBreakerSystem.js';

describe('EventBus & CircuitBreaker Security & Anti-Death-Spiral Tests', () => {
  test('EventBus should emit and listen to domain events', () => {
    const bus = new SimulationEventBus();
    let receivedPayload = null;

    bus.on('PARCEL_CREATED', (data) => {
      receivedPayload = data;
    });

    bus.emit('PARCEL_CREATED', { parcelId: 101, sku: 'FULLDY-SHIRT' });

    assert.deepEqual(receivedPayload, { parcelId: 101, sku: 'FULLDY-SHIRT' });
  });

  test('CircuitBreaker should trigger Fulldy HQ Emergency Credit when cash drops below zero', () => {
    const bus = new SimulationEventBus();
    let emergencyTriggered = false;
    let emergencyAmount = 0;

    bus.on('EMERGENCY_CREDIT_ACTIVATED', (payload) => {
      emergencyTriggered = true;
      emergencyAmount = payload.amount;
    });

    const gameState = {
      fulldyCash: -1500,
      emergencyCreditUsed: false,
      reputationStars: 4.2
    };

    CircuitBreakerSystem.checkBankruptcyGuard(gameState, bus);

    assert.equal(emergencyTriggered, true, 'Emergency credit event should fire');
    assert.equal(gameState.emergencyCreditUsed, true, 'Emergency credit flag must be set');
    assert.ok(gameState.fulldyCash > 0, 'Cash must be restored to positive balance');
    assert.equal(emergencyAmount, 50000, 'Emergency credit line default should be 50,000');
  });

  test('CircuitBreaker should grant Merchant Grace Period rather than terminating contract instantly', () => {
    const bus = new SimulationEventBus();
    let graceWarningEmitted = false;

    bus.on('MERCHANT_GRACE_WARNING', (payload) => {
      graceWarningEmitted = true;
    });

    const merchantState = {
      merchantId: 'VIP_FASHION_01',
      slaFailCount: 3,
      contractActive: true,
      inGracePeriod: false
    };

    CircuitBreakerSystem.checkMerchantGrace(merchantState, bus);

    assert.equal(graceWarningEmitted, true, 'Grace period warning should emit');
    assert.equal(merchantState.inGracePeriod, true, 'Merchant should enter grace period');
    assert.equal(merchantState.contractActive, true, 'Contract must not be cancelled immediately');
  });
});
