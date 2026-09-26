import type { Chain } from 'viem/chains';
import type { AppConfig, Mode, ComponentTheme } from './types';

export class OnchainKitConfigError extends Error {
  public field: string;
  public suggestion: string;

  constructor(message: string, field: string, suggestion: string) {
    super(`OnchainKit Config Error: ${message}\n\nSuggestion: ${suggestion}`);
    this.name = 'OnchainKitConfigError';
    this.field = field;
    this.suggestion = suggestion;
  }
}

export type OnchainKitProviderConfig = {
  apiKey?: string;
  chain: Chain;
  config?: AppConfig;
  projectId?: string;
  rpcUrl?: string;
};

/**
 * Validates the chain configuration.
 */
function validateChain(chain: unknown): void {
  if (!chain) {
    throw new OnchainKitConfigError(
      'Missing required field: "chain"',
      'chain',
      'Provide a valid chain object from viem/chains (e.g., import { base } from "viem/chains" and pass chain={base})',
    );
  }

  if (typeof chain !== 'object') {
    throw new OnchainKitConfigError(
      'Invalid "chain" configuration',
      'chain',
      'The chain prop must be a valid Chain object from viem/chains. Example: import { base } from "viem/chains"; <OnchainKitProvider chain={base} />',
    );
  }

  const chainObj = chain as Record<string, unknown>;
  if (typeof chainObj.id !== 'number') {
    throw new OnchainKitConfigError(
      'Invalid "chain.id" - must be a number',
      'chain.id',
      'Ensure you are using a valid chain object from viem/chains with a numeric id property',
    );
  }
}

/**
 * Validates a string field that should not be empty.
 */
function validateStringField(
  value: unknown,
  fieldName: string,
  suggestion: string,
): void {
  if (typeof value !== 'string') {
    throw new OnchainKitConfigError(
      `Invalid "${fieldName}" - must be a string`,
      fieldName,
      suggestion,
    );
  }

  if (value.trim() === '') {
    throw new OnchainKitConfigError(
      `Invalid "${fieldName}" - cannot be empty string`,
      fieldName,
      suggestion,
    );
  }
}

/**
 * Validates a URL field.
 */
function validateUrlField(
  value: unknown,
  fieldName: string,
  suggestion: string,
): void {
  validateStringField(value, fieldName, suggestion);

  try {
    new URL(value as string);
  } catch {
    throw new OnchainKitConfigError(
      `Invalid "${fieldName}" - not a valid URL: "${value}"`,
      fieldName,
      suggestion,
    );
  }
}

/**
 * Validates the appearance configuration.
 */
function validateAppearance(config: AppConfig | undefined): void {
  if (!config?.appearance) {
    return;
  }

  const { mode, theme } = config.appearance;

  const validModes: Mode[] = ['auto', 'light', 'dark'];
  if (mode !== undefined && mode !== null && !validModes.includes(mode)) {
    throw new OnchainKitConfigError(
      `Invalid "config.appearance.mode" - "${mode}" is not a valid mode`,
      'config.appearance.mode',
      `Valid modes are: ${validModes.map((m) => `"${m}"`).join(', ')}. Remove the prop to use the default ("auto").`,
    );
  }

  const validThemes: ComponentTheme[] = [
    'default',
    'base',
    'cyberpunk',
    'hacker',
  ];
  if (theme !== undefined && theme !== null && !validThemes.includes(theme)) {
    throw new OnchainKitConfigError(
      `Invalid "config.appearance.theme" - "${theme}" is not a valid theme`,
      'config.appearance.theme',
      `Valid themes are: ${validThemes.map((t) => `"${t}"`).join(', ')}. Remove the prop to use the default ("default").`,
    );
  }
}

/**
 * Validates the OnchainKitProvider configuration.
 * Throws descriptive errors for invalid or missing configuration.
 */
export function validateOnchainKitConfig(
  config: OnchainKitProviderConfig,
): void {
  // Validate required chain field
  validateChain(config.chain);

  // Validate apiKey format if provided
  if (config.apiKey !== undefined && config.apiKey !== null) {
    validateStringField(
      config.apiKey,
      'apiKey',
      'The apiKey should be a string. Remove the prop if you do not have an API key, or provide a valid string.',
    );
  }

  // Validate projectId format if provided
  if (config.projectId !== undefined && config.projectId !== null) {
    validateStringField(
      config.projectId,
      'projectId',
      'The projectId should be a string. Remove the prop if you do not have a project ID.',
    );
  }

  // Validate rpcUrl format if provided
  if (config.rpcUrl !== undefined && config.rpcUrl !== null) {
    validateUrlField(
      config.rpcUrl,
      'rpcUrl',
      'The rpcUrl must be a valid URL. Example: "https://mainnet.base.org" or "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"',
    );
  }

  // Validate config.appearance if provided
  validateAppearance(config.config);

  // Validate config.paymaster if provided
  if (
    config.config?.paymaster !== undefined &&
    config.config?.paymaster !== null
  ) {
    validateUrlField(
      config.config.paymaster,
      'config.paymaster',
      'The paymaster must be a valid URL. Example: "https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY"',
    );
  }
}
