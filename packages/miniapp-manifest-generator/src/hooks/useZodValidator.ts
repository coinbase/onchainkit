import { z } from 'zod';

function flattenData(
  obj: Record<string, unknown>,
  prefix = '',
): Array<{ path: string; value: unknown }> {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      return flattenData(value as Record<string, unknown>, path);
    }
    return [{ path, value }];
  });
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

function getSchemaFields(
  schema: z.ZodSchema,
  prefix = '',
): Array<{ path: string; value: unknown; isRequired: boolean }> {
  const fields: Array<{ path: string; value: unknown; isRequired: boolean }> = [];

  if (schema instanceof z.ZodObject) {
    Object.entries(schema.shape).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (value instanceof z.ZodObject) {
        fields.push(...getSchemaFields(value, path));
      } else if (value instanceof z.ZodDiscriminatedUnion) {
        value.options.forEach((option: z.ZodObject<z.ZodRawShape>) => {
          fields.push(...getSchemaFields(option, path));
        });
      } else {
        fields.push({
          path,
          value,
          isRequired: !value.isOptional?.(),
        });
      }
    });
  }

  return fields;
}

export function useZodValidator(
  schema: z.ZodSchema,
  data: Record<string, unknown>,
) {

  const schemaFields = getSchemaFields(schema);
  console.log('schemaFields', schemaFields);

  // flatten nested data to path.path: value
  const flattenedData = flattenData(data);

  // create hash of required fields
  const requiredFields = flattenedData.reduce<Record<string, boolean>>(
    (acc, { path }) => {
      acc[path] = isRequired(schema, path);
      return acc;
    },
    {},
  );

  // validate data against schema
  const zData = schema.safeParse(data);
  const zErrors = zData.error?.format();

  console.log('zErrors', zErrors);
  console.log('flattened zErrors', zData.error?.flatten());

  // flatten zod errors to path.path: error
  const flattenedZodErrors = flattenZErrors(
    zErrors ?? ({} as Record<string, unknown>),
  );

  // get any missing fields
  const missingFields = Object.keys(flattenedZodErrors).reduce(
    (acc, key) => {
      if (!flattenedData.some(({ path }) => path === key)) {
        acc.push({
          path: key,
          value: data[key],
        });
      }
      return acc;
    },
    [] as Array<{ path: string; value: unknown }>,
  );

  return {
    missingFields,
    data: flattenedData,
    errors: flattenedZodErrors,
    valid: !zErrors,
    requiredFields,
  };
}
