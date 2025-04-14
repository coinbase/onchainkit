import { Frame } from '../types';
import { ValidateJson } from './ValidateJson';

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
  return <ValidateJson json={frame} validationRules={VALIDATION} />;
}
