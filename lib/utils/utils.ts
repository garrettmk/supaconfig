

export function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max)
}


export function range(start: number, end: number, step: number = 1) {
  return Array.from(
    { length: Math.floor((end - start) / step) + 1 }, 
    (_, i) => start + (i * step)
  );
}

export function asyncTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function omitNullValues<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null)
  ) as Partial<T>;
}

export function isEmpty(obj: object) {
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number = 20) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function pick<T extends object, K extends keyof T>(from: T, fields: K[]) {
  return Object.fromEntries(
    Object
      .entries(from)
      .filter(([key, value]) => fields.includes(key as K))
  );
}