import { Fragment } from 'react';
import { flattenObject } from '../utilities/flattenObject';

type ValidateJsonProps = {
  json: Record<string, unknown>;
  validationRules: Record<
    string,
    {
      isRequired: boolean;
      isValid: (value: string) => boolean;
      errorMsg: string;
    }
  >;
};

export function ValidateJson({ json, validationRules }: ValidateJsonProps) {
  let isAllValid = true;
  const fields = flattenObject(json as Record<string, unknown>);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {fields.map(({ path, value }) => {
        const validation = validationRules[path];
        if (!validation) {
          return null;
        }

        const { isRequired, isValid, errorMsg } = validation;
        const valid = value !== undefined && isValid(value as string);

        if (isRequired && !valid) {
          isAllValid = false;
        }

        if (!isRequired && !value) {
          return null;
        }

        return (
          <Fragment key={path}>
            <div className="grid grid-cols-[4px_280px_1fr_30px] gap-2 text-gray-500">
              <span>{isRequired && '*'}</span>
              <span className="font-bold">{path}:</span>
              <span>{value?.toString() || 'not set'}</span>
              {Boolean(value) && <span>{valid ? '✅' : '❌'}</span>}
            </div>
            {!valid && (
              <div className="text-red-500 text-sm italic ml-3 -mt-1 mb-1">
                {errorMsg}
              </div>
            )}
          </Fragment>
        );
      })}
      <span className="text-gray-500">* marked fields are required</span>
      {isAllValid && (
        <p className="text-green-500">✅ Your frame metadata is valid!</p>
      )}
    </div>
  );
}
