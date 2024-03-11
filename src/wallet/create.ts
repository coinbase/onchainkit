
const initSmartWallet = (options: CreateOptions) => {
  return {
    init: async () => Promise.resolve(),
    getPrivateKey: () => 'private-key'
  }
};

const initEmbeddedWallet = (options: CreateOptions) => {
  return {
    init: async () => Promise.resolve(),
    getPrivateKey: () => 'private-key'
  }
};

type CreateOptions = {
  mnemonic?: string;
  network: string;
  privateKey?: string;
  typeOfWallet: 'smart-wallet' | 'embedded-wallet';
};

type Wallet = {
  init: () => Promise<void>;
  getPrivateKey: () => string;
} | {
  init: () => Promise<void>;
  getPrivateKey: () => string;
};

export const create = async (options: CreateOptions): Promise<Wallet> => {
  if (options.typeOfWallet === 'smart-wallet') {
    const wallet = initSmartWallet(options);
    await wallet.init();
    return wallet;
  } else if (options.typeOfWallet === 'embedded-wallet') { 
    const wallet = initEmbeddedWallet(options);
    await wallet.init();
    return wallet;
  }
  throw new Error('Invalid wallet type');
}
