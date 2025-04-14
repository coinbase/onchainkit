import { FrameMetadata } from '../types';
import { ValidateJson } from './ValidateJson';

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

export function ValidateMetadata({ metadata }: ValidateMetadataProps) {
  return <ValidateJson json={metadata} validationRules={VALIDATION} />;
}
