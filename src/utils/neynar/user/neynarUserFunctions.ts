import { FetchError } from '../exceptions/FetchError';
import { getDataFromNeynar } from '../getDataFormNeynar';

export const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';
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

export async function neynarBulkUserLookup(
  farcasterIDs: number[],
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<NeynarBulkUserLookupModel | undefined> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterIDs.join(',')}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  return convertToNeynarResponseModel(responseBody);
}

function convertToNeynarResponseModel(data: any): NeynarBulkUserLookupModel | undefined {
  if (!data) {
    return;
  }

  const response: NeynarBulkUserLookupModel = {
    users: [],
  };

  for (const user of data.users) {
    const formattedUser = convertToNeynarUserModel(user);
    if (formattedUser) {
      response.users.push(formattedUser);
    }
  }
  return response;
}

function convertToNeynarUserModel(data: any): NeynarUserModel | undefined {
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
