"use client";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/miniapp-sdk";
import { useQuery } from "@tanstack/react-query";
import styles from "./UserInfo.module.css";

function useUserInfo() {
  const { isInMiniApp } = useIsInMiniApp();

  return useQuery({
    queryKey: ["useQuickAuth", isInMiniApp],
    queryFn: async () => {
      // If we're in a mini app context, all we have to do to make an authenticated
      // request is to use `sdk.quickAuth.fetch`. This will automatically include the
      // necessary `Authorization` header for the backend to verify.

      const result = await sdk.quickAuth.fetch("/api/me");
      const userInfo = await result.json();

      return {
        displayName: userInfo.display_name,
        pfpUrl: userInfo.pfp_url,
        bio: userInfo.profile?.bio?.text,
        followerCount: userInfo.follower_count,
        followingCount: userInfo.following_count,
      };
    },
    enabled: !!isInMiniApp,
  });
}

export function UserInfo() {
  const { data, isLoading, error } = useUserInfo();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingAvatar}></div>
          <div className={styles.loadingTextContainer}>
            <div className={styles.loadingTextLong}></div>
            <div className={styles.loadingTextShort}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>
          {error ? "Failed to load user info" : "No user info available"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Profile Picture */}
        {data.pfpUrl && (
          <img
            src={data.pfpUrl}
            alt={`${data.displayName}'s profile picture`}
            className={styles.profilePicture}
          />
        )}

        {/* User Info */}
        <div className={styles.userInfo}>
          {/* Display Name */}
          <h2 className={styles.displayName}>{data.displayName}</h2>

          {/* Bio */}
          {data.bio && <p className={styles.bio}>{data.bio}</p>}

          {/* Follower Stats */}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {data.followerCount?.toLocaleString() || "0"}
              </span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {data.followingCount?.toLocaleString() || "0"}
              </span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
