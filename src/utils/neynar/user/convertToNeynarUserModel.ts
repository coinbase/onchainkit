import { NeynarUserModel } from './types';

export function convertToNeynarUserModel(data: any): NeynarUserModel | undefined {
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
