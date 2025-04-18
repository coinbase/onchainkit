import { Fragment } from 'react';
import { FrameMetadata } from '../types';

const VALIDATION = {
  version: {
    isRequired: true,
    isValid: (value: string) => value === '1' || value === 'next',
    errorMsg: 'Version must be "1" or "next"',
  },

  imageUrl: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Image URL is required and max length is 1024 characters',
  },

  'button.title': {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 32,
    errorMsg: 'Button title is required and max length is 32 characters',
  },

  'button.action.type': {
    isRequired: true,
    isValid: (value: string) =>
      value === 'launch_frame' || value === 'view_token',
    errorMsg: 'Action type must be "launch_frame" or "view_token"',
  },

  'button.action.url': {
    isRequired: false,
    isValid: (value: string) =>
      !value || (value.length > 0 && value.length <= 1024),
    errorMsg: 'Action URL max length is 1024 characters',
  },

  'button.action.name': {
    isRequired: false,
    isValid: (value: string) =>
      !value || (value.length > 0 && value.length <= 32),
    errorMsg: 'Action name max length is 32 characters',
  },

  'button.action.splashImageUrl': {
    isRequired: false,
    isValid: (value: string) =>
      !value || (value.length > 0 && value.length <= 1024),
    errorMsg: 'Splash image URL max length is 1024 characters',
  },

  'button.action.splashBackgroundColor': {
    isRequired: false,
    isValid: (value: string) => !value || /^#([0-9a-fA-F]{6})$/.test(value),
    errorMsg: 'Splash background color must be a valid hex color',
  },
};

type ValidateMetadataProps = {
  metadata: FrameMetadata;
};

export function ValidateMetadata({ metadata }: ValidateMetadataProps) {
  let isAllValid = true;

  const getNestedValue = (
    obj: Record<string, unknown>,
    path: string,
  ): unknown => {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {Object.entries(VALIDATION).map(
        ([key, { isRequired, isValid, errorMsg }]) => {
          const value = getNestedValue(
            metadata as Record<string, unknown>,
            key,
          );

          const valid = value !== undefined && isValid(value as string);

          if (isRequired && !valid) {
            isAllValid = false;
          }

          if (!isRequired && !value) {
            return null;
          }

          return (
            <Fragment key={key}>
              <div className="grid grid-cols-[4px_280px_1fr_30px] gap-2 text-gray-500">
                <span>{isRequired && '*'}</span>
                <span className="font-bold">{key}:</span>
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
        },
      )}
      <span className="text-gray-500">* marked fields are required</span>
      {isAllValid && (
        <p className="text-green-500">✅ Your frame metadata is valid!</p>
      )}
    </div>
  );
}
