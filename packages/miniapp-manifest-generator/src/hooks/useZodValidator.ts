import { z } from 'zod';

function flattenData(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return {
        ...acc,
        ...flattenData(value as Record<string, unknown>, path),
      };
    }

    return { ...acc, [path]: value };
  }, {});
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

export function useZodValidator(
  schema: z.ZodSchema,
  data: Record<string, unknown>,
) {
  const flattenedData = flattenData(data);

  function getSchemaFields(
    schemaNode: z.ZodSchema,
    prefix = '',
  ): Array<{ path: string; value: unknown; required: boolean }> {
    const fields: Array<{ path: string; value: unknown; required: boolean }> =
      [];

    if (schemaNode instanceof z.ZodObject) {
      Object.entries(schemaNode.shape).forEach(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value instanceof z.ZodObject) {
          fields.push(...getSchemaFields(value, path));
        } else if (value instanceof z.ZodDiscriminatedUnion) {
          const discriminator = value._def.discriminator;
          const discriminatorPath = `${path}.${discriminator}`;
          const discriminatorValue = flattenedData[discriminatorPath];

          // get discriminator options based on set data
          const selectedOption =
            value.options.find(
              (opt: z.ZodObject<z.ZodRawShape>) =>
                opt.shape[discriminator]._def.value === discriminatorValue,
            ) || value.options[0];

          if (selectedOption) {
            fields.push(...getSchemaFields(selectedOption, path));
          }
        } else {
          fields.push({
            path,
            value,
            required: !(value instanceof z.ZodOptional),
          });
        }
      });
    }

    return fields;
  }

  const schemaFields = getSchemaFields(schema);
  const zData = schema.safeParse(data);
  const zErrors = zData.error?.format();
  const flattenedZodErrors = flattenZErrors(
    zErrors ?? ({} as Record<string, unknown>),
  );

  const validatedData = schemaFields.map(({ path, required }) => ({
    path,
    required,
    value: flattenedData[path],
    errors: flattenedZodErrors[path],
  }));

  return {
    data: validatedData,
    valid: !zData.error,
  };
}
