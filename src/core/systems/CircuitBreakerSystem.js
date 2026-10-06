/**
 * CircuitBreakerSystem
 * Hệ thống 3 Chốt chặn Ngắt mạch chống Vòng xoáy tử thần (Death Spiral Guards)
 * 1. Gói cứu trợ tài chính khẩn cấp Fulldy HQ
 * 2. Thời gian ân hạn khách hàng (Grace Period)
 * 3. Hợp đồng chữa cháy B2B Bulk Orders
 */
export class CircuitBreakerSystem {
  /**
   * Chốt chặn 1: Cứu trợ dòng tiền âm (Fulldy HQ Emergency Credit Line)
   */
  static checkBankruptcyGuard(gameState, eventBus) {
    if (gameState.fulldyCash < 0 && !gameState.emergencyCreditUsed) {
      gameState.emergencyCreditUsed = true;
      const creditLineAmount = Math.max(50000, Math.abs(gameState.fulldyCash) + 20000);
      gameState.fulldyCash += creditLineAmount;

      if (eventBus) {
        eventBus.emit('EMERGENCY_CREDIT_ACTIVATED', {
          amount: creditLineAmount,
          newBalance: gameState.fulldyCash,
          repayTermsShifts: 10
        });
      }
    }
  }

  /**
   * Chốt chặn 2: Ân hạn khách hàng khi bão đơn vỡ SLA
   */
  static checkMerchantGrace(merchantState, eventBus) {
    if (merchantState.slaFailCount >= 3 && !merchantState.inGracePeriod) {
      merchantState.inGracePeriod = true;
      merchantState.graceShiftsRemaining = 3;

      if (eventBus) {
        eventBus.emit('MERCHANT_GRACE_WARNING', {
          merchantId: merchantState.merchantId,
          graceShifts: 3,
          message: 'Khách hàng gửi tối hậu thư cảnh báo thay vì hủy hợp đồng ngay lập tức.'
        });
      }
    }
  }
}
