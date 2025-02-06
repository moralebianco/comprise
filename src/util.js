/** @type {{ limit: number; offset: number }} */
export const PAGE = Object.freeze({ limit: 0, offset: 0 });

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

/**
 * @template T
 * @param {unknown} obj
 * @param {T} tpt template
 * @returns {obj is T}
 */
export function isTypeOf(obj, tpt) {
  switch (typeof tpt) {
    case 'boolean':
      if (!tpt && obj === undefined) return true;
      return typeof obj === 'boolean';
    case 'number':
      if (tpt === 0 && obj === undefined) return true;
      return typeof obj === 'number' && Number.isFinite(obj);
    case 'string':
      if (tpt === '' && obj === undefined) return true;
      return typeof obj === 'string';
    case 'object':
      if (tpt === null) return obj == undefined;
      if (Array.isArray(tpt)) {
        if (!Array.isArray(obj)) return false;
        if (tpt.length === 0) return true;
        return !obj.some((o) => !isTypeOf(o, tpt[0]));
      }
      if (typeof obj !== 'object' || obj === null) return false;
      return !Object.keys(tpt).some((k) => !isTypeOf(obj[k], tpt[k]));
    default:
      throw new Error();
  }
}
