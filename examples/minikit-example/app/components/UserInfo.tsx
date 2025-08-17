"use client";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/miniapp-sdk";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Avatar,
  Title,
  Text,
  Group,
  Stack,
  Skeleton,
  Center,
} from "@mantine/core";

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
      <Card withBorder p="md" radius="md">
        <Group align="flex-start" gap="md">
          <Skeleton height={64} circle />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton height={20} width={128} />
            <Skeleton height={16} width={96} />
          </Stack>
        </Group>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card withBorder p="md" radius="md">
        <Center>
          <Text c="dimmed" ta="center">
            {error ? "Failed to load user info" : "No user info available"}
          </Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card withBorder p="xl" radius="md">
      <Group align="flex-start" gap="md">
        {/* Profile Picture */}
        {data.pfpUrl && (
          <Avatar
            src={data.pfpUrl}
            alt={`${data.displayName}'s profile picture`}
            size={64}
          />
        )}

        {/* User Info */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          {/* Display Name */}
          <Title
            order={2}
            size="lg"
            fw={600}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {data.displayName}
          </Title>

          {/* Bio */}
          {data.bio && (
            <Text c="dimmed" size="sm" lh={1.6}>
              {data.bio}
            </Text>
          )}

          {/* Follower Stats */}
          <Group gap="xl" mt="xs">
            <Stack align="center" gap={2}>
              <Text fw={600} size="sm">
                {data.followerCount?.toLocaleString() || "0"}
              </Text>
              <Text c="dimmed" size="xs">
                Followers
              </Text>
            </Stack>
            <Stack align="center" gap={2}>
              <Text fw={600} size="sm">
                {data.followingCount?.toLocaleString() || "0"}
              </Text>
              <Text c="dimmed" size="xs">
                Following
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
