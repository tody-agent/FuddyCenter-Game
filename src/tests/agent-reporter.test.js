import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { AgentReporter } from '../core/reporting/AgentReporter.js';

describe('AgentReporter Real-time Progress Tracking Tests', () => {
  const testStateFile = path.resolve('.test-agent-state.json');

  beforeEach(() => {
    if (fs.existsSync(testStateFile)) {
      fs.unlinkSync(testStateFile);
    }
  });

  test('AgentReporter should register and update agent progress', () => {
    const reporter = new AgentReporter({ stateFilePath: testStateFile });

    reporter.report({
      agentId: 'ecs-engine-dev',
      role: 'ECS Simulation Core Developer',
      status: 'WORKING',
      task: 'Optimizing bitECS 0.4 SoA memory buffer',
      progress: 65,
      metrics: { entitiesCount: 10000, tickMs: 1.1 }
    });

    const agent = reporter.getAgent('ecs-engine-dev');
    assert.ok(agent, 'Agent should be recorded');
    assert.equal(agent.status, 'WORKING');
    assert.equal(agent.progress, 65);
    assert.equal(agent.metrics.entitiesCount, 10000);
    assert.ok(agent.lastUpdated, 'Timestamp should be recorded');
  });

  test('AgentReporter should calculate overall sprint progress accurately', () => {
    const reporter = new AgentReporter({ stateFilePath: testStateFile });

    reporter.report({
      agentId: 'agent-1',
      role: 'Role 1',
      status: 'DONE',
      task: 'Task 1',
      progress: 100
    });

    reporter.report({
      agentId: 'agent-2',
      role: 'Role 2',
      status: 'WORKING',
      task: 'Task 2',
      progress: 50
    });

    const summary = reporter.getOverallProgress();
    assert.equal(summary.totalAgents, 2);
    assert.equal(summary.averageProgress, 75); // (100 + 50) / 2 = 75%
  });

  test('AgentReporter should record activity logs in FIFO order', () => {
    const reporter = new AgentReporter({ stateFilePath: testStateFile, maxLogs: 5 });

    for (let i = 1; i <= 7; i++) {
      reporter.logActivity(`agent-${i}`, `Action ${i}`);
    }

    const logs = reporter.getRecentLogs();
    assert.equal(logs.length, 5, 'Log list should be capped at maxLogs');
    assert.equal(logs[logs.length - 1].message, 'Action 7', 'Latest log should be at the end');
  });
});
