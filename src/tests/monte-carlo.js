/**
 * Monte Carlo Simulation Stress-Test
 * Giả lập 10.000 ca vận hành kho dưới các kịch bản cực đoan:
 * - Bão đơn Mega Sale dồn dập
 * - Thợ thời vụ bùng ca 40%
 * - Kiểm chứng tác dụng ngắt mạch của 3 Chốt chặn Circuit Breakers (Boxme Emergency Credit & Grace Period)
 */
import { SimulationEventBus } from '../core/events/EventBus.js';
import { CircuitBreakerSystem } from '../core/systems/CircuitBreakerSystem.js';

export function runMonteCarloSimulations(iterations = 10000) {
  console.log(`\n============================================================`);
  console.log(`🎲 BẮT ĐẦU MONTE CARLO STRESS-TEST (${iterations.toLocaleString()} CA VẬN HÀNH)`);
  console.log(`============================================================`);

  const results = {
    totalShifts: iterations,
    bankruptciesWithoutGuard: 0,
    bankruptciesWithGuard: 0,
    emergencyCreditsTriggered: 0,
    merchantGraceTriggered: 0,
    slaP10: 0,
    slaP50: 0,
    slaP90: 0
  };

  const slaHistory = [];

  for (let shift = 1; shift <= iterations; shift++) {
    const isMegaSale = Math.random() < 0.15; // 15% xác suất rơi vào ngày Mega Sale
    const baseOrders = isMegaSale ? 80000 : 15000;
    const workerCapacity = 60; // 60 thợ kho
    const tempNoShowRate = isMegaSale ? 0.35 : 0.05; // Thợ thời vụ bùng ca

    const effectiveWorkers = workerCapacity * (1 - tempNoShowRate);
    const maxCapacityOrders = effectiveWorkers * 250; // Mỗi thợ xử lý 250 đơn/ca
    const fulfilledOrders = Math.min(baseOrders, maxCapacityOrders);

    const slaRate = Math.min(1.0, fulfilledOrders / baseOrders);
    slaHistory.push(slaRate);

    // Kịch bản Dòng tiền (Boxme Cash)
    let cashFlow = (fulfilledOrders * 1.5) - (workerCapacity * 200) - (isMegaSale ? 50000 : 10000);
    if (slaRate < 0.85) {
      cashFlow -= (baseOrders - fulfilledOrders) * 5.0; // Phạt SLA sàn TMĐT
    }

    // 1. Kiểm tra kịch bản KHÔNG có Circuit Breaker
    if (cashFlow < -20000) {
      results.bankruptciesWithoutGuard++;
    }

    // 2. Kiểm tra kịch bản CÓ Circuit Breaker
    const bus = new SimulationEventBus();
    const gameState = { boxmeCash: cashFlow, emergencyCreditUsed: false };

    if (cashFlow < 0) {
      CircuitBreakerSystem.checkBankruptcyGuard(gameState, bus);
      if (gameState.emergencyCreditUsed) {
        results.emergencyCreditsTriggered++;
      }
    }

    if (gameState.boxmeCash < -20000) {
      results.bankruptciesWithGuard++;
    }

    // 3. Kiểm tra Grace Period
    if (slaRate < 0.8) {
      const merchant = { merchantId: `MERCHANT_${shift % 10}`, slaFailCount: 3, inGracePeriod: false, contractActive: true };
      CircuitBreakerSystem.checkMerchantGrace(merchant, bus);
      if (merchant.inGracePeriod) {
        results.merchantGraceTriggered++;
      }
    }
  }

  // Tính phân vị P10, P50, P90
  slaHistory.sort((a, b) => a - b);
  results.slaP10 = (slaHistory[Math.floor(iterations * 0.10)] * 100).toFixed(1);
  results.slaP50 = (slaHistory[Math.floor(iterations * 0.50)] * 100).toFixed(1);
  results.slaP90 = (slaHistory[Math.floor(iterations * 0.90)] * 100).toFixed(1);

  console.log(`📊 KẾT QUẢ PHÂN TÍCH XÁC SUẤT:`);
  console.log(`- SLA P10 (Kịch bản xấu nhất đêm bão đơn):  ${results.slaP10}%`);
  console.log(`- SLA P50 (Kịch bản bình thường trung vị):  ${results.slaP50}%`);
  console.log(`- SLA P90 (Kịch bản năng suất cao):         ${results.slaP90}%`);
  console.log(`- Tỷ lệ phá sản KHÔNG có Circuit Breaker:   ${((results.bankruptciesWithoutGuard / iterations) * 100).toFixed(2)}% (${results.bankruptciesWithoutGuard} ca)`);
  console.log(`- Tỷ lệ phá sản CÓ Circuit Breaker:         ${((results.bankruptciesWithGuard / iterations) * 100).toFixed(2)}% (${results.bankruptciesWithGuard} ca)`);
  console.log(`- Số lần kích hoạt Gói cứu trợ Boxme HQ:     ${results.emergencyCreditsTriggered.toLocaleString()} lần`);
  console.log(`- Số lần kích hoạt Ân hạn khách hàng:       ${results.merchantGraceTriggered.toLocaleString()} lần`);
  console.log(`============================================================\n`);

  return results;
}

if (process.argv[1].endsWith('monte-carlo.js')) {
  runMonteCarloSimulations(10000);
}
