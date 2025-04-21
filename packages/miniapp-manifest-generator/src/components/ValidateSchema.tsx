import { Fragment } from 'react';
import { useZodValidator } from '../hooks/useZodValidator';
import { z } from 'zod';

type ValidateSchemaProps = {
  schema: z.ZodSchema;
  schemaData: Record<string, unknown>;
};

export function ValidateSchema({ schema, schemaData }: ValidateSchemaProps) {
  const { data, errors, valid, missingFields, requiredFields } =
    useZodValidator(schema, schemaData);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {data.map(({ path, value }) => {
        const valid = !errors[path];
        const required = requiredFields[path];

        return (
          <Fragment key={path}>
            <div className="grid grid-cols-[4px_280px_1fr_30px] gap-2 text-gray-500">
              <span>{required && '*'}</span>
              <span className="font-bold">{path}:</span>
              <span>{value?.toString() || 'not set'}</span>
              {Boolean(value) && <span>{valid ? '✅' : '❌'}</span>}
            </div>
            {!valid && (
              <div className="text-red-500 text-sm italic ml-3 -mt-1 mb-1">
                {errors[path]?.map((error) => <p key={error}>{error}</p>)}
              </div>
            )}
          </Fragment>
        );
      })}
      {missingFields.length > 0 && (
        <>
          <div className="text-black">Missing required fields</div>
          <div className="text-red-500 text-sm italic ml-3 -mt-1 mb-1">
            {missingFields.map(({ path, value }) => (
              <div key={path}>
                {path}: {value?.toString() || 'not set'}
              </div>
            ))}
          </div>
        </>
      )}
      <span className="text-gray-500">* marked fields are required</span>
      {valid && (
        <p className="text-green-500">✅ Your frame metadata is valid!</p>
      )}
    </div>
  );
}
