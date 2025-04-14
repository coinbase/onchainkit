export function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Array<{ path: string; value: unknown }> {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      return flattenObject(value as Record<string, unknown>, path);
    }
    return [{ path, value }];
  });
}
