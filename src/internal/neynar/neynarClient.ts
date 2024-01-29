import { NeynarUserFunction } from './user/neynarUserFunctions';

export class NeynarClient {
  private apiKey;

  public user: NeynarUserFunction;
  constructor(apiKey = 'NEYNAR_API_DOCS') {
    this.apiKey = apiKey;

    // Import various function types at construction to have better readability and
    // composability of our interfaces.
    this.user = new NeynarUserFunction(apiKey);
  }
}
