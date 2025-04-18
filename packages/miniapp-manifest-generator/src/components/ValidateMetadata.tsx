import { Fragment } from 'react';
import { FrameMetadata } from '../types';

const VALIDATION: Record<
  string,
  {
    isRequired: boolean;
    isValid: (value: string) => boolean;
    errorMsg: string;
  }
> = {
  version: {
    isRequired: true,
    isValid: (value) => value === '1' || value === 'next',
    errorMsg: 'Version must be "1" or "next"',
  },
  imageUrl: {
    isRequired: true,
    isValid: (value) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Image URL is required and max length is 1024 characters',
  },
  'button.title': {
    isRequired: true,
    isValid: (value) => value.length > 0 && value.length <= 32,
    errorMsg: 'Button title is required and max length is 32 characters',
  },
  'button.action.type': {
    isRequired: true,
    isValid: (value) => value === 'launch_frame' || value === 'view_token',
    errorMsg: 'Action type must be "launch_frame" or "view_token"',
  },
  'button.action.url': {
    isRequired: false,
    isValid: (value) => !value || (value.length > 0 && value.length <= 1024),
    errorMsg: 'Action URL max length is 1024 characters',
  },
  'button.action.name': {
    isRequired: false,
    isValid: (value) => !value || (value.length > 0 && value.length <= 32),
    errorMsg: 'Action name max length is 32 characters',
  },
  'button.action.splashImageUrl': {
    isRequired: false,
    isValid: (value) => !value || (value.length > 0 && value.length <= 1024),
    errorMsg: 'Splash image URL max length is 1024 characters',
  },
  'button.action.splashBackgroundColor': {
    isRequired: false,
    isValid: (value) => !value || /^#([0-9a-fA-F]{6})$/.test(value),
    errorMsg: 'Splash background color must be a valid hex color',
  },
};

type ValidateMetadataProps = {
  metadata: FrameMetadata;
};

function flattenObject(
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

export function ValidateMetadata({ metadata }: ValidateMetadataProps) {
  let isAllValid = true;
  const fields = flattenObject(metadata as Record<string, unknown>);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {fields.map(({ path, value }) => {
        const validation = VALIDATION[path];
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
