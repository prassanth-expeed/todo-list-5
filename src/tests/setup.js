import { beforeEach } from 'vitest';

beforeEach(() => {
  // Ensure tests are isolated from each other's localStorage.
  window.localStorage.clear();
});
