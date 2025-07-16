import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  const url = new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000");

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: url.host,
    });
    const userInfoResult = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=[${payload.sub}]`,
      {
        headers: {
          "x-api-key": process.env.NEYNAR_API_KEY || "",
        },
      },
    ).then((res) => res.json());

    return NextResponse.json(userInfoResult[0]);
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info("Invalid token:", e.message);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    throw e;
  }
}
