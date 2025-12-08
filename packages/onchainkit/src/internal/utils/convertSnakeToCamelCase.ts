/**
 * Converts snake_case keys to camelCase in an object or array of objects.
 * @param {T} obj - The object, array, or string to convert. (required)
 * @returns {T} The converted object, array, or string.
 */
export function convertSnakeToCamelCase<T>(obj: T): T {
  if (typeof obj === 'string') {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamelCase(item)) as T;
  }

  if (obj && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc: T, key: string) => {
      const camelCaseKey = toCamelCase<T>(key);
      acc[camelCaseKey] = convertSnakeToCamelCase(obj[key as keyof T]);
      return acc;
    }, {} as T);
  }
  return obj;
}

function toCamelCase<T>(str: string): keyof T {
  return str.replace(/_([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  ) as keyof T;
}
