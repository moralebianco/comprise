export function snakeToCamel(str) {
  return str.replace(/([a-z]_[a-z])/g, (g) => `${g[0]}${g[2].toUpperCase()}`);
}

export function camelToSnake(str) {
  return str.replace(/([a-z][A-Z])/g, (g) => `${g[0]}_${g[1].toLowerCase()}`);
}

/**
 * @param {object} obj
 * @param {(str: string) => string} func
 * @returns {object}
 */
export function clone(obj, func = (s) => s) {
  if (typeof obj != 'object') return obj;
  const copy = {};
  for (const key in obj) copy[func(key)] = obj[key];
  return copy;
}
