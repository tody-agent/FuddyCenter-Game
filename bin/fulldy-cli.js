#!/usr/bin/env node
/**
 * Fulldy Center — CLI Dashboard
 * Terminal Interactive Monitor & Agent Progress Reporter
 */
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { defaultReporter, AgentReporter } from '../src/core/reporting/AgentReporter.js';
import { DashboardTUI } from '../src/cli/DashboardTUI.js';

const reporter = defaultReporter;

// Khởi tạo trạng thái mặc định cho các subagents nếu chưa có
function ensureInitialAgents() {
  const currentAgents = reporter.getAllAgents();
  if (currentAgents.length === 0) {
    reporter.report({
      agentId: 'game-producer',
      role: 'Game Producer & Scrum Master',
      status: 'WORKING',
      task: 'Điều phối Sprint & Phân rã bite-sized tasks',
      progress: 90
    });

    reporter.report({
      agentId: 'security-architect',
      role: 'Security & Red Team Auditor',
      status: 'DONE',
      task: 'Quét an ninh, chặn RCE & AGPL-3.0 copyleft',
      progress: 100
    });

    reporter.report({
      agentId: 'ecs-engine-dev',
      role: 'ECS Simulation Core Developer',
      status: 'DONE',
      task: 'Lõi bitECS 0.4 SoA & Fixed-Tick 30Hz Loop',
      progress: 100
    });

    reporter.report({
      agentId: 'navigation-dev',
      role: 'Robotics & Pathfinding Dev',
      status: 'DONE',
      task: 'Ma trận Flow Field Dijkstra Map O(1)',
      progress: 100
    });

    reporter.report({
      agentId: 'code-qa-tester',
      role: 'Automated Code QA & TDD',
      status: 'DONE',
      task: '14 Unit tests & Monte Carlo 10.000 ca',
      progress: 100
    });
  }
}

ensureInitialAgents();

function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
}

function renderScreen() {
  clearScreen();
  console.log(DashboardTUI.render({ reporter }));
}

// Chạy một lệnh hệ thống và tạm dừng để xem kết quả
function runAction(command, title) {
  clearScreen();
  console.log(`\x1b[1m\x1b[36m▶ ĐANG THỰC HIỆN: ${title}...\x1b[0m\n`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
  } catch (err) {
    console.error(`\x1b[31m[LỖI KHI CHẠY LỆNH]: ${err.message}\x1b[0m`);
  }
  console.log(`\n\x1b[33m[Bấm Enter để quay lại Dashboard...]\x1b[0m`);
}

// Giả lập cập nhật tiến trình của Agent thời gian thực
function simulateAgentStep() {
  const agents = ['ecs-engine-dev', 'navigation-dev', 'code-qa-tester', 'game-producer', 'security-architect'];
  const tasks = [
    'Tối ưu hóa GPU InstancedMesh Three.js',
    'Cân bằng Monte Carlo P50/P90',
    'Kiểm định bộ nhớ TypedArray',
    'Tích hợp WebAudio synthesizer',
    'Thẩm định an ninh commit'
  ];

  const randomAgent = agents[Math.floor(Math.random() * agents.length)];
  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
  const current = reporter.getAgent(randomAgent) || { progress: 80 };
  const newProgress = Math.min(100, (current.progress || 0) + 5);
  const newStatus = newProgress >= 100 ? 'DONE' : 'WORKING';

  reporter.report({
    agentId: randomAgent,
    status: newStatus,
    task: randomTask,
    progress: newProgress
  });
}

const isWatchMode = process.argv.includes('--watch') || process.argv.includes('--monitor');

renderScreen();

if (isWatchMode) {
  // Chế độ Watch tự động cập nhật mỗi 2 giây
  setInterval(() => {
    renderScreen();
  }, 2000);
} else {
  // Chế độ tương tác bàn phím trực tiếp
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  let inSubCommand = false;

  process.stdin.on('keypress', (str, key) => {
    if (inSubCommand) {
      if (key.name === 'return' || key.name === 'enter') {
        inSubCommand = false;
        renderScreen();
      }
      return;
    }

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      clearScreen();
      console.log('👋 Tạm biệt! Fulldy Center CLI đã dừng.\n');
      process.exit(0);
    }

    switch (str) {
      case '1':
        renderScreen();
        break;
      case '2':
        inSubCommand = true;
        runAction('npm test', 'Kiểm Thử Đơn Vị TDD (npm test)');
        break;
      case '3':
        inSubCommand = true;
        runAction('node src/tests/monte-carlo.js', 'Giả Lập Monte Carlo 10.000 Ca');
        break;
      case '4':
        inSubCommand = true;
        runAction('python3 scripts/audit-gamedev-skills.py .', 'Quét An Ninh Skills & Code');
        break;
      case '5':
        simulateAgentStep();
        renderScreen();
        break;
      default:
        renderScreen();
        break;
    }
  });
}
