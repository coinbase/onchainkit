import { Errors, createClient } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

function getUrlHost(request: NextRequest) {
  // First try to get the origin from the Origin header (most reliable for CORS requests)
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return url.host;
    } catch (error) {
      console.warn("Invalid origin header:", origin, error);
    }
  }

  // Fallback to Host header
  const host = request.headers.get("host");
  if (host) {
    return host;
  }

  // Final fallback to environment variables (your original logic)
  let urlValue: string;
  if (process.env.VERCEL_ENV === "production") {
    urlValue = process.env.NEXT_PUBLIC_URL!;
  } else if (process.env.VERCEL_URL) {
    urlValue = `https://${process.env.VERCEL_URL}`;
  } else {
    urlValue = "http://localhost:3000";
  }

  const url = new URL(urlValue);
  return url.host;
}

export async function GET(request: NextRequest) {
  // Because we're fetching this endpoint via `sdk.quickAuth.fetch`,
  // if we're in a mini app, the request will include the necessary `Authorization` header.
  const authorization = request.headers.get("Authorization");

  // Here we ensure that we have a valid token.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing token" }, { status: 401 });
  }

  const domain = getUrlHost(request);

  console.log("Domain: ", domain);

  try {
    // Now we verify the token. `domain` must match the domain of the request.
    // In our case, we're using the `getUrlHost` function to get the domain of the request
    // based on the Vercel environment. This will vary depending on your hosting provider.
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain,
    });

    // If the token was valid, `payload.sub` will be the user's Farcaster ID.
    const userFid = payload.sub;

    // And now we can use that FID to do whatever we want.
    // In this example, we're going to get the user's info from Neynar and return it.
    const userInfoResult = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${userFid}`,
      {
        headers: {
          "x-api-key": process.env.NEYNAR_API_KEY || "",
        },
      },
    ).then((res) => res.json());

    const userInfo = userInfoResult?.users?.[0];

    if (!userInfo) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    throw e;
  }
}
