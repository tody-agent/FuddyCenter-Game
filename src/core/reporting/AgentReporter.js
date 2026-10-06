import fs from 'node:fs';
import path from 'node:path';

/**
 * AgentReporter
 * Module theo dõi và lưu trữ trạng thái tiến độ thời gian thực của các AI Agent
 * Hỗ trợ lưu trữ bền vững (file persistence) để CLI Dashboard đọc realtime
 */
export class AgentReporter {
  constructor({ stateFilePath = path.resolve('.agent-state.json'), maxLogs = 50 } = {}) {
    this.stateFilePath = stateFilePath;
    this.maxLogs = maxLogs;
    this.agents = new Map();
    this.logs = [];

    this.loadState();
  }

  loadState() {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const raw = fs.readFileSync(this.stateFilePath, 'utf8');
        const data = JSON.parse(raw);
        if (data.agents) {
          for (const [id, agent] of Object.entries(data.agents)) {
            this.agents.set(id, agent);
          }
        }
        if (Array.isArray(data.logs)) {
          this.logs = data.logs.slice(-this.maxLogs);
        }
      }
    } catch {
      // Bỏ qua lỗi đọc file, khởi tạo trạng thái sạch
    }
  }

  saveState() {
    try {
      const data = {
        updatedAt: new Date().toISOString(),
        agents: Object.fromEntries(this.agents.entries()),
        logs: this.logs
      };
      fs.writeFileSync(this.stateFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[AgentReporter] Failed to save state to disk:', err.message);
    }
  }

  /**
   * Agent báo cáo cập nhật tiến độ
   */
  report({ agentId, role = 'AI Agent', status = 'WORKING', task = '', progress = 0, metrics = {} }) {
    const existing = this.agents.get(agentId) || {};
    const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

    const agentRecord = {
      ...existing,
      agentId,
      role: role || existing.role || 'AI Agent',
      status, // IDLE | WORKING | TESTING | BLOCKED | DONE
      task,
      progress: clampedProgress,
      metrics: { ...(existing.metrics || {}), ...metrics },
      lastUpdated: new Date().toISOString()
    };

    this.agents.set(agentId, agentRecord);
    this.logActivity(agentId, `[${status}] ${task} (${clampedProgress}%)`);
    this.saveState();
    return agentRecord;
  }

  /**
   * Ghi nhận dòng nhật ký hoạt động
   */
  logActivity(agentId, message) {
    const entry = {
      timestamp: new Date().toLocaleTimeString(),
      agentId,
      message
    };
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.saveState();
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }

  getRecentLogs() {
    return [...this.logs];
  }

  getOverallProgress() {
    const agents = this.getAllAgents();
    if (agents.length === 0) {
      return { totalAgents: 0, averageProgress: 0, completedCount: 0, workingCount: 0 };
    }

    let sum = 0;
    let completedCount = 0;
    let workingCount = 0;

    for (let i = 0; i < agents.length; i++) {
      sum += agents[i].progress || 0;
      if (agents[i].status === 'DONE' || agents[i].progress >= 100) {
        completedCount++;
      } else if (agents[i].status === 'WORKING') {
        workingCount++;
      }
    }

    return {
      totalAgents: agents.length,
      averageProgress: Math.round(sum / agents.length),
      completedCount,
      workingCount
    };
  }
}

// Singleton instance dùng chung trong toàn bộ workspace
export const defaultReporter = new AgentReporter();
