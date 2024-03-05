/**
 * Raw Response from Neynar
 */
export interface NeynarFrameValidationInternalModel {
  valid: boolean;
  action: {
    object: string;
    interactor: {
      object: string;
      fid: number;
      custody_address: string;
      username: null | string;
      display_name: string;
      pfp_url: string;
      profile: {
        bio: {
          text: string;
          mentioned_profiles?: any[];
        };
      };
      follower_count: number;
      following_count: number;
      verifications: any[];
      verified_addresses: {
        eth_addresses: string[] | null;
        sol_addresses: string[] | null;
      };
      active_status: string;
      viewer_context: {
        following: boolean;
        followed_by: boolean;
      };
    };
    tapped_button: {
      index: number;
    };
    input: {
      text: string;
    };
    url: string;
    state: {
      serialized: string;
    };
    cast: {
      object: string;
      hash: string;
      thread_hash: string;
      parent_hash: null | string;
      parent_url: string;
      root_parent_url: string;
      parent_author: {
        fid: null | number;
      };
      author: {
        object: string;
        fid: number;
        custody_address: string;
        username: string;
        display_name: string;
        pfp_url: string;
        profile: {
          bio: {
            text: string;
            mentioned_profiles?: any[];
          };
        };
        follower_count: number;
        following_count: number;
        verifications: any[];
        active_status: string;
        viewer_context: {
          liked: boolean;
          recasted: boolean;
        };
      };
      text: string;
      timestamp: string;
      embeds: {
        url: string;
      }[];
      frames: {
        version: string;
        title: string;
        image: string;
        image_aspect_ratio: string;
        buttons: {
          index: number;
          title: string;
          action_type: string;
        }[];
        input: {
          text?: string;
        };
        state: {
          serialized?: string;
        };
        post_url: string;
        frames_url: string;
      }[];
      reactions: {
        likes: {
          fid: number;
          fname: string;
        }[];
        recasts: {
          fid: number;
          fname: string;
        }[];
      };
      replies: {
        count: number;
      };
      mentioned_profiles: {
        object: string;
        fid: number;
        custody_address: string;
        username: string;
        display_name: string;
        pfp_url: string;
        profile: {
          bio: {
            text: string;
            mentioned_profiles?: any[];
          };
        };
        follower_count: number;
        following_count: number;
        verifications: any[];
        active_status: string;
      }[];
      viewer_context: {
        liked: boolean;
        recasted: boolean;
      };
    };
    timestamp: string;
  };
}
