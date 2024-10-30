var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/version.ts
var version = "0.35.2";

// src/network/neynar/FetchError.ts
var _FetchError = class _FetchError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchError";
  }
};
__name(_FetchError, "FetchError");
var FetchError = _FetchError;

// src/network/neynar/neynarFrameValidation.ts
var NEYNAR_DEFAULT_API_KEY = "NEYNAR_ONCHAIN_KIT";

// src/network/neynar/getDataFromNeynar.ts
async function getDataFromNeynar(url, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const options = {
    method: "GET",
    url,
    headers: {
      accept: "application/json",
      api_key: apiKey,
      "content-type": "application/json",
      onchainkit_version: version
    }
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  return await resp.json();
}
__name(getDataFromNeynar, "getDataFromNeynar");

// src/network/neynar/getCustodyAddressForFidNeynar.ts
async function getCustodyAddressForFidNeynar(fid, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody?.users?.[0]?.custody_address) {
    throw new Error(`No custody address found for FID ${fid}`);
  }
  return responseBody.users[0].custody_address;
}
__name(getCustodyAddressForFidNeynar, "getCustodyAddressForFidNeynar");

// src/network/neynar/getVerifiedAddressesForFidNeynar.ts
async function getVerifiedAddressesForFidNeynar(fid, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody?.users?.[0]?.verifications?.length) {
    throw new Error(`No verified addresses found for FID ${fid}`);
  }
  return responseBody.users[0].verifications;
}
__name(getVerifiedAddressesForFidNeynar, "getVerifiedAddressesForFidNeynar");

// src/farcaster/getFarcasterUserAddress.ts
async function getFarcasterUserAddress(fid, options) {
  try {
    const hasCustodyAddress = options?.hasCustodyAddress ?? true;
    const hasVerifiedAddresses = options?.hasVerifiedAddresses ?? true;
    const response = {};
    if (hasCustodyAddress) {
      const custodyAddress = await getCustodyAddressForFidNeynar(fid, options?.neynarApiKey);
      if (custodyAddress) {
        response.custodyAddress = custodyAddress;
      }
    }
    if (hasVerifiedAddresses) {
      const verifiedAddresses = await getVerifiedAddressesForFidNeynar(fid, options?.neynarApiKey);
      if (verifiedAddresses) {
        response.verifiedAddresses = verifiedAddresses;
      }
    }
    return response;
  } catch (_e) {
    return null;
  }
}
__name(getFarcasterUserAddress, "getFarcasterUserAddress");
export {
  getFarcasterUserAddress
};
//# sourceMappingURL=index.js.map