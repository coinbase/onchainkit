import type { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Redis } from "@upstash/redis";

if (!process.env.NEXT_PUBLIC_REDIS_URL) {
  throw new Error('REDIS_URL is not defined')
}

if (!process.env.NEXT_PUBLIC_REDIS_TOKEN) {
  throw new Error('REDIS_TOKEN is not defined')
}

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_REDIS_URL,
  token: process.env.NEXT_PUBLIC_REDIS_TOKEN
})

const redisKey = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'minikit';

function getUserNotificationDetailsKey(fid: number): string {
  return `${redisKey}:user:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<FrameNotificationDetails | null> {
  return await redis.get<FrameNotificationDetails>(
    getUserNotificationDetailsKey(fid)
  );
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: FrameNotificationDetails
): Promise<void> {
  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  await redis.del(getUserNotificationDetailsKey(fid));
}