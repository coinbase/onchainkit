/**
 * Converts snake_case keys to camelCase in an object or array of objects or strings.
 * @param {T} obj - The object, array, or string to convert. (required)
 * @returns {T} The converted object, array, or string.
 */
export function convertSnakeToCamelCase<T>(obj: T): T {
  if (typeof obj === 'string') {
    return toCamelCase(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamelCase(item)) as T;
  }

  if (obj && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelCaseKey = toCamelCase(key);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (acc as any)[camelCaseKey] = convertSnakeToCamelCase<T>(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (obj as any)[key],
      );
      return acc;
    }, {} as T);
  }
  return obj;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
