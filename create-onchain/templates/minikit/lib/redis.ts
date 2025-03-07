import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL) {
  console.warn('REDIS_URL environment variable is not defined')
}

if (!process.env.REDIS_TOKEN) {
  console.warn('REDIS_TOKEN environment variable is not defined')
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})
