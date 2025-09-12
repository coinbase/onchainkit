"use client";
import { useQuickAuth } from "@coinbase/onchainkit/minikit";
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

export function UserInfo() {
  const { data, isLoading, error } = useQuickAuth<{
    displayName: string;
    pfpUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
  }>("/api/me");

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
