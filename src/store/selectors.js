import { isValidTodo } from '../storage/validate';

function toSortableOrder(order) {
  return Number.isFinite(order) ? order : Number.POSITIVE_INFINITY;
}

function toSortableTime(isoString) {
  const t = Date.parse(isoString);
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

export function selectPendingTodos(state) {
  if (!state || !Array.isArray(state.todos)) return [];

  return state.todos.filter((t) => isValidTodo(t) && t.completed === false);
}

export function sortTodos(items) {
  // Stable deterministic sort: include original index as final tie-breaker.
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = toSortableOrder(a.item.order);
      const bo = toSortableOrder(b.item.order);
      if (ao !== bo) return ao - bo;

      const at = toSortableTime(a.item.createdAt);
      const bt = toSortableTime(b.item.createdAt);
      if (at !== bt) return at - bt;

      const aid = String(a.item.id);
      const bid = String(b.item.id);
      if (aid < bid) return -1;
      if (aid > bid) return 1;

      return a.index - b.index;
    })
    .map((x) => x.item);
}
