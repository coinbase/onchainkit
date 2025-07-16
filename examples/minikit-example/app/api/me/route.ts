import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

function getCurrentUrl() {
  if (process.env.VERCEL_ENV === "production" && process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  const url = new URL(getCurrentUrl());

  try {
    console.log("url", url.host);
    console.log("authorization", authorization);
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: url.host,
    });
    console.log("payload", payload);
    const userInfoResult = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${payload.sub}`,
      {
        headers: {
          "x-api-key": process.env.NEYNAR_API_KEY || "",
        },
      },
    ).then((res) => res.json());
    console.log("userInfoResult", userInfoResult);
    const userInfo = userInfoResult?.users?.[0];

    if (!userInfo) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info("Invalid token:", e.message);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    throw e;
  }
}
