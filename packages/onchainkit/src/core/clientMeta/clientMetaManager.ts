import sdk from '@farcaster/frame-sdk';

export type ClientMeta = {
  mode: 'onchainkit' | 'minikit';
  clientFid: number | null;
};

class ClientMetaManager {
  public clientMeta: ClientMeta | null = null;

  private initPromise: Promise<ClientMeta> | null = null;

  public async init({ isMiniKit }: { isMiniKit: boolean }) {
    if (this.isInitialized()) {
      console.warn('ClientMetaManager already initialized');
      return;
    }

    this.initPromise = this.handleInit({ isMiniKit });
  }

  public isInitialized() {
    return !!this.initPromise;
  }

  public async getClientMeta() {
    if (!this.initPromise) throw new Error('ClientMetaManager not initialized');
    if (!this.clientMeta) return await this.initPromise;
    return this.clientMeta;
  }

  private async handleInit({ isMiniKit }: { isMiniKit: boolean }) {
    let clientFid: number | null = null;

    try {
      const context = await sdk.context;
      clientFid = context?.client?.clientFid || null;
    } catch (error) {
      console.error('Error getting client FID', error);
    }

    this.clientMeta = {
      mode: isMiniKit ? 'minikit' : 'onchainkit',
      clientFid,
    };

    return this.clientMeta;
  }
}

export const clientMetaManager = new ClientMetaManager();
