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
