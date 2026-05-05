import { ref } from 'vue';

export const routes = {
  '/': { name: 'Todo' },
  '/about': { name: 'About' }
};

function parseHashToPath(hash) {
  if (!hash) return '/';
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function normalizePath(path) {
  const p = path && typeof path === 'string' ? path : '/';
  const normalized = p.startsWith('/') ? p : `/${p}`;
  return routes[normalized] ? normalized : '/';
}

export function createRouter(win = window) {
  const currentRoute = ref(normalizePath(parseHashToPath(win.location.hash)));

  function syncFromLocation() {
    currentRoute.value = normalizePath(parseHashToPath(win.location.hash));
  }

  function navigate(path) {
    const normalized = normalizePath(path);
    const nextHash = `#${normalized}`;
    if (win.location.hash !== nextHash) {
      win.location.hash = nextHash;
    } else {
      // If hash is unchanged, still ensure state is synced
      syncFromLocation();
    }
  }

  win.addEventListener('hashchange', syncFromLocation);

  return {
    currentRoute,
    navigate,
    _syncFromLocation: syncFromLocation
  };
}
