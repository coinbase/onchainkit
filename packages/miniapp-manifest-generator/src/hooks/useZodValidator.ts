import { z } from 'zod';

function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object') {
        return {
          ...acc,
          ...flattenObject(value as Record<string, unknown>, path),
        };
      }
      return { ...acc, [path]: value };
    },
    {} as Record<string, unknown>,
  );
}

function flattenZErrors(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string[]> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (key === '_errors' && Array.isArray(value) && value.length > 0) {
        return { ...acc, [prefix]: value };
      }

      const path = prefix ? `${prefix}.${key}` : key;
      const next = flattenZErrors(value as Record<string, unknown>, path);
      return { ...acc, ...next };
    },
    {} as Record<string, string[]>,
  );
}

function isRequired(schema: z.ZodSchema, path: string): boolean {
  const segments = path.split('.');
  let current = schema as z.ZodObject<z.ZodRawShape>;

  for (const segment of segments) {
    if (!current.shape?.[segment]) {
      return true;
    }
    current = current.shape[segment] as z.ZodObject<z.ZodRawShape>;
  }

  return !current.isOptional?.();
}

export function useZodValidator(
  schema: z.ZodSchema,
  data: Record<string, unknown>,
) {
  // validate data against schema
  const zData = schema.safeParse(data);
  const zErrors = zData.error?.format();

  // flatten zod errors to path.path: error
  const flattenedZodErrors = flattenZErrors(
    zErrors ?? ({} as Record<string, unknown>),
  );

  const flattenedDataObj = flattenObject(data);

  const finalData = Array.from(
    new Set([
      ...Object.keys(flattenedDataObj),
      ...Object.keys(flattenedZodErrors),
    ]),
  )
    .map((field) => ({
      path: field,
      value: flattenedDataObj[field],
      required: isRequired(schema, field),
      errors: flattenedZodErrors?.[field],
    }))
    .sort((a, b) => {
      // 1. Required items first
      if (a.required && !b.required) return -1;
      if (!a.required && b.required) return 1;

      const aSegments = a.path.split('.');
      const bSegments = b.path.split('.');

      // 2. Sort by segment count first (shorter paths first)
      if (aSegments.length !== bSegments.length) {
        return aSegments.length - bSegments.length;
      }

      // 3. Group segments with the same prefix together
      // Compare each segment level by level
      const minLength = Math.min(aSegments.length, bSegments.length);

      for (let i = 0; i < minLength; i++) {
        if (aSegments[i] !== bSegments[i]) {
          return aSegments[i].localeCompare(bSegments[i]);
        }
      }

      // 4. Alphabetize as final fallback
      return a.path.localeCompare(b.path);
    });

  return {
    data: finalData,
    valid: !zErrors,
  };
}
