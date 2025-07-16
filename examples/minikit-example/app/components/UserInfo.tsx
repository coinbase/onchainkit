import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";

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
    enabled: isInMiniApp,
  });
}

export function UserInfo() {
  const { data, isLoading, error } = useUserInfo();

  if (isLoading) {
    return (
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[var(--app-gray)] rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-[var(--app-gray)] rounded w-32"></div>
            <div className="h-4 bg-[var(--app-gray)] rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4">
        <p className="text-[var(--app-foreground-muted)] text-center">
          {error ? "Failed to load user info" : "No user info available"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        {data.pfpUrl && (
          <img
            src={data.pfpUrl}
            alt={`${data.displayName}'s profile picture`}
            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--app-card-border)]"
          />
        )}

        {/* User Info */}
        <div className="flex-1 min-w-0">
          {/* Display Name */}
          <h2 className="text-xl font-bold text-[var(--app-foreground)] mb-2 truncate">
            {data.displayName}
          </h2>

          {/* Bio */}
          {data.bio && (
            <p className="text-[var(--app-foreground-muted)] text-sm mb-3 leading-relaxed">
              {data.bio}
            </p>
          )}

          {/* Follower Stats */}
          <div className="flex space-x-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[var(--app-foreground)]">
                {data.followerCount?.toLocaleString() || "0"}
              </span>
              <span className="text-[var(--app-foreground-muted)]">
                Followers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-[var(--app-foreground)]">
                {data.followingCount?.toLocaleString() || "0"}
              </span>
              <span className="text-[var(--app-foreground-muted)]">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
