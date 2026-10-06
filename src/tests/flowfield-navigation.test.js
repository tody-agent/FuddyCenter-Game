import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { FlowFieldGrid } from '../core/nav/FlowFieldGrid.js';

describe('Flow Field Pathfinding & Navigation Tests', () => {
  test('FlowFieldGrid should generate integration field and flow vectors to target', () => {
    // 5x5 grid, target at (4, 4) - bottom right
    const grid = new FlowFieldGrid({ width: 5, height: 5 });
    grid.setTarget(4, 4);
    grid.compute();

    // At (4, 4) distance should be 0
    assert.equal(grid.getDistance(4, 4), 0);

    // Direction at (0, 0) should guide agent towards (4, 4)
    const [vx, vy] = grid.getFlowVector(0, 0);
    assert.ok(vx >= 0 && vy >= 0, 'Vector should point right and down towards (4,4)');
    assert.ok(Math.abs(vx) > 0 || Math.abs(vy) > 0, 'Vector should not be zero at non-target');
  });

  test('FlowFieldGrid should navigate around obstacles (racking rows)', () => {
    // 5x5 grid with wall at (2, 1), (2, 2), (2, 3)
    const grid = new FlowFieldGrid({ width: 5, height: 5 });
    grid.setObstacle(2, 1, true);
    grid.setObstacle(2, 2, true);
    grid.setObstacle(2, 3, true);

    grid.setTarget(4, 2);
    grid.compute();

    // Path from (1, 2) to (4, 2) cannot go directly through obstacle at (2, 2)
    const [vx, vy] = grid.getFlowVector(1, 2);
    // Flow should go up or down around the wall, not directly east through (2, 2)
    assert.ok(vy !== 0 || vx <= 0, 'Agent at (1,2) should route around obstacle');
    assert.equal(grid.isObstacle(2, 2), true);
  });

  test('FlowField query should be instant O(1) for 500 agents', () => {
    const grid = new FlowFieldGrid({ width: 50, height: 50 });
    grid.setTarget(25, 25);
    grid.compute();

    const start = performance.now();
    for (let i = 0; i < 500; i++) {
      const rx = (i * 7) % 50;
      const ry = (i * 13) % 50;
      const vec = grid.getFlowVector(rx, ry);
      assert.ok(Array.isArray(vec) && vec.length === 2);
    }
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 20, `500 vector lookups should take < 20ms (Actual: ${elapsed.toFixed(2)}ms)`);
  });
});
