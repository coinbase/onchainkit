import { BASE_URL } from "./constants";

export type SimpleHashError = {
  code: number;
  message: string;
};

export type SimpleHashRequest<T> = {
  params: T[];
};

export type SimpleHashResult<T> = {
  error?: SimpleHashError;
  result: T;
};

const SIMPLE_HASH_API = '';


export function buildSimpleHashUrl<T>(method: string, params: T[]): string {
  return `${BASE_URL}/${method}?${JSON.stringify(params)}`;
}

export function buildSimpleHashHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };
}

export async function sendRequest<T, V>(
  params: T[]
): Promise<SimpleHashResult<V>> {
  try {
    const response = await fetch(buildSimpleHashUrl('owners', params), buildSimpleHashHeaders(SIMPLE_HASH_API));
    const data = await response.json();  
    return data;
  } catch (error) {
    console.log(
      `sendRequest: error sending SimpleHash request: ${(error as Error).message}`,
    );
    throw error;
  }
}