import { Fragment } from 'react';
import { Frame } from '../types';

// validation from https://miniapps.farcaster.xyz/docs/specification
const VALIDATION = {
  version: {
    isRequired: true,
    isValid: (value: string) => value === 'next' || value.startsWith('1.'),
    errorMsg: 'Version must be either "next" or start with "1."',
  },
  name: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 32,
    errorMsg: 'Name is required and max length is 32 characters',
  },
  homeUrl: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Home URL is required and max length is 1024 characters',
  },
  iconUrl: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Icon URL is required and max length is 1024 characters',
  },
  imageUrl: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Image URL is required and max length is 1024 characters',
  },
  buttonTitle: {
    isRequired: true,
    isValid: (value: string) => value.length > 0 && value.length <= 32,
    errorMsg: 'Button title is required and max length is 32 characters',
  },
  splashImageUrl: {
    isRequired: false,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Splash image URL is max length is 1024 characters',
  },
  splashBackgroundColor: {
    isRequired: false,
    isValid: (value: string) => /^#([0-9a-fA-F]{6})$/.test(value),
    errorMsg: 'Splash background color must be a valid hex color',
  },
  webhookUrl: {
    isRequired: false,
    isValid: (value: string) => value.length > 0 && value.length <= 1024,
    errorMsg: 'Webhook URL is max length is 1024 characters',
  },
};

type ValidateFrameProps = {
  frame: Frame;
};

export function ValidateFrame({ frame }: ValidateFrameProps) {
  let isAllValid = true;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {Object.entries(frame).map(([key, value]) => {
        const { isRequired, isValid, errorMsg } =
          VALIDATION[key as keyof typeof frame];
        const valid = isValid(value);

        if (!valid) {
          isAllValid = false;
        }

        return (
          <Fragment key={key}>
            <div className="grid grid-cols-[4px_200px_1fr_30px] gap-2 text-gray-500">
              <span>{isRequired && '*'}</span>
              <span className="font-bold">{key}:</span>
              <span>{value}</span>
              <span>{valid ? '✅' : '❌'}</span>
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
        <p className="text-green-500">✅ Your frame configuration is valid!</p>
      )}
    </div>
  );
}
