import { FetchError } from '../exceptions/FetchError';

export interface NeynarUserModel {
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  verifications: string[];
}
export interface NeynarBulkUserLookupModel {
  users: NeynarUserModel[];
}

export class NeynarUserFunction {
  private apiKey;
  constructor(apiKey = 'NEYNAR_API_DOCS') {
    this.apiKey = apiKey;
  }
  async bulkUserLookup(farcasterIDs: number[]): Promise<NeynarBulkUserLookupModel | undefined> {
    const options = {
      method: 'GET',
      url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterIDs.join(',')}`,
      headers: { accept: 'application/json', api_key: this.apiKey },
    };
    const resp = await fetch(options.url, { headers: options.headers });
    if (resp.status !== 200) {
      throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
    }
    const responseBody = await resp.json();
    return this.convertToNeynarResponseModel(responseBody);
  }

  private convertToNeynarResponseModel(data: any): NeynarBulkUserLookupModel | undefined {
    if (!data) {
      return;
    }

    const response: NeynarBulkUserLookupModel = {
      users: [],
    };

    for (const user of data.users) {
      const formattedUser = this.convertToNeynarUserModel(user);
      if (formattedUser) {
        response.users.push(formattedUser);
      }
    }
    return response;
  }

  private convertToNeynarUserModel(data: any): NeynarUserModel | undefined {
    if (!data) {
      return;
    }

    return {
      fid: data.fid ?? 0,
      custody_address: data.custody_address ?? '',
      username: data.username ?? '',
      display_name: data.display_name ?? '',
      pfp_url: data.pfp_url ?? '',
      profile: {
        bio: {
          text: data.profile?.bio?.text ?? '',
        },
      },
      follower_count: data.follower_count ?? 0,
      verifications: Array.isArray(data.verifications) ? data.verifications : [],
    };
  }
}
