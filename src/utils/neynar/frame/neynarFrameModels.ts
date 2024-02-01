/**
 * Simplified Object model with the raw Neynar data if-needed.
 */
export interface NeynarFrameValidationResponse {
  valid: boolean;
  button: number;
  liked: boolean;
  recasted: boolean;
  following: boolean;
  interactor: {
    fid: number;
    custody_address: string;
    verified_accounts: string[];
  };
  raw: NeynarFrameValidationInternalModel;
}
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
      active_status: string;
      viewer_context: {
        following: boolean;
        followed_by: boolean;
      };
    };
    tapped_button: {
      index: number;
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
        buttons: {
          index: number;
          title: string;
          action_type: string;
        }[];
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
  };
}

export function convertToNeynarResponseModel(data: any): NeynarFrameValidationResponse | undefined {
  if (!data) {
    return;
  }

  /**
   * Note: This is not a type-safe conversion, however, balancing that risk with an additional import
   * to include a library like AJV which can accomplish that.  Alternatively, we could write conversions
   * for each type, but that seemed overkill.
   */
  const neynarResponse = data as NeynarFrameValidationInternalModel;

  // Shorten paths
  const action = neynarResponse.action;
  const cast = action?.cast;
  const interactor = action?.interactor;

  return {
    valid: neynarResponse.valid,
    button: action?.tapped_button?.index,
    liked: cast?.viewer_context?.liked,
    recasted: cast?.viewer_context?.recasted,
    following: action?.interactor?.viewer_context?.following,
    interactor: {
      fid: interactor?.fid,
      custody_address: interactor?.custody_address,
      verified_accounts: interactor?.verifications,
    },
    raw: neynarResponse,
  };
}
