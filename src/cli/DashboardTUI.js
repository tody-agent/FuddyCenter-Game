/**
 * DashboardTUI
 * Giao diện Terminal tương tác trực quan cho Fulldy Center — Smart Fulfillment Tycoon
 */
export class DashboardTUI {
  static getColors() {
    return {
      reset: '\x1b[0m',
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      cyan: '\x1b[36m',
      sky: '\x1b[96m',
      blue: '\x1b[34m',
      cobalt: '\x1b[94m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      amber: '\x1b[93m',
      red: '\x1b[31m',
      magenta: '\x1b[35m',
      bgBlue: '\x1b[44m',
      bgDark: '\x1b[40m'
    };
  }

  static renderProgressBar(percent, length = 20) {
    const p = Math.max(0, Math.min(100, percent));
    const filled = Math.round((p / 100) * length);
    const empty = length - filled;
    const c = this.getColors();

    const bar = `${c.cyan}${'█'.repeat(filled)}${c.dim}${'░'.repeat(empty)}${c.reset}`;
    return `[${bar}] ${p}%`;
  }

  static formatStatusBadge(status) {
    const c = this.getColors();
    switch (status) {
      case 'DONE':
        return `${c.green}● DONE   ${c.reset}`;
      case 'WORKING':
        return `${c.sky}▶ WORKING${c.reset}`;
      case 'TESTING':
        return `${c.magenta}◆ TESTING${c.reset}`;
      case 'BLOCKED':
        return `${c.red}✖ BLOCKED${c.reset}`;
      case 'IDLE':
      default:
        return `${c.dim}○ IDLE   ${c.reset}`;
    }
  }

  static pad(str, len) {
    const s = String(str || '');
    if (s.length >= len) return s.slice(0, len - 1) + '…';
    return s + ' '.repeat(len - s.length);
  }

  /**
   * Render toàn bộ Dashboard ra chuỗi ANSI
   */
  static render({ reporter, mode = 'LIVE' }) {
    const c = this.getColors();
    const agents = reporter.getAllAgents();
    const summary = reporter.getOverallProgress();
    const logs = reporter.getRecentLogs().slice(-6);

    const out = [];

    // Header Cyber Logistics
    out.push(`${c.bold}${c.cobalt}┌────────────────────────────────────────────────────────────────────────────────────────┐${c.reset}`);
    out.push(`${c.bold}${c.cobalt}│  📦 FULLDY CENTER — SMART FULFILLMENT TYCOON OPERATIONS CENTER                         │${c.reset}`);
    out.push(`${c.bold}${c.cobalt}│  🌐 Fulldy Central Megahub | Digital Twin & Tycoon Engine                              │${c.reset}`);
    out.push(`${c.bold}${c.cobalt}└────────────────────────────────────────────────────────────────────────────────────────┘${c.reset}`);

    // Tiến độ tổng quan (Sprint Overview)
    const progressBar = this.renderProgressBar(summary.averageProgress, 30);
    out.push(`\n${c.bold}📊 TIẾN ĐỘ SPRINT TỔNG QUAN:${c.reset} ${progressBar}  (${c.green}${summary.completedCount} Xong${c.reset} | ${c.sky}${summary.workingCount} Đang làm${c.reset} | ${summary.totalAgents} Agents)`);
    out.push(`${c.dim}──────────────────────────────────────────────────────────────────────────────────────────${c.reset}`);

    // Bảng trạng thái chi tiết của từng Agent
    out.push(`${c.bold}${c.cyan}${this.pad('VAI TRÒ / AGENT ID', 24)} ${this.pad('TRẠNG THÁI', 12)} ${this.pad('TIẾN ĐỘ', 16)} ${this.pad('NHIỆM VỤ HIỆN TẠI', 34)}${c.reset}`);
    out.push(`${c.dim}──────────────────────────────────────────────────────────────────────────────────────────${c.reset}`);

    if (agents.length === 0) {
      out.push(`  ${c.dim}(Chưa có báo cáo nào từ agents. Bấm [5] để nạp dữ liệu mẫu hoặc kích hoạt agent)${c.reset}`);
    } else {
      for (const a of agents) {
        const idCol = this.pad(a.agentId, 24);
        const statusBadge = this.formatStatusBadge(a.status);
        const progBar = this.renderProgressBar(a.progress, 8);
        const taskCol = this.pad(a.task, 34);

        out.push(`${c.bold}${idCol}${c.reset} ${statusBadge} ${progBar} ${c.dim}${taskCol}${c.reset}`);
      }
    }

    out.push(`${c.dim}──────────────────────────────────────────────────────────────────────────────────────────${c.reset}`);

    // Dòng nhật ký thời gian thực (Live Telemetry & Activity Feed)
    out.push(`${c.bold}📡 NHẬT KÝ HOẠT ĐỘNG THỜI GIAN THỰC (LIVE TELEMETRY FEED):${c.reset}`);
    if (logs.length === 0) {
      out.push(`  ${c.dim}Chờ sự kiện...${c.reset}`);
    } else {
      for (const log of logs) {
        out.push(`  ${c.dim}[${log.timestamp}]${c.reset} ${c.sky}${this.pad(log.agentId, 18)}${c.reset} ${log.message}`);
      }
    }

    out.push(`\n${c.bold}${c.amber}⚡ BẢNG ĐIỀU KHIỂN TƯƠNG TÁC (PRESS KEY):${c.reset}`);
    out.push(`${c.cyan}[1] Làm mới   [2] Chạy Unit Tests   [3] Chạy Monte Carlo   [4] Quét An Ninh   [5] Giả Lập Agent   [q] Thoát${c.reset}`);

    return out.join('\n');
  }
}
