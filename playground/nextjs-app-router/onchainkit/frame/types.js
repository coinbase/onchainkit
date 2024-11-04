/**
 * Frame Data
 *
 * Note: exported as public Type
 */

/**
 * Frame Request
 *
 * Note: exported as public Type
 */

/**
 * Simplified Object model with the raw Neynar data if-needed.
 */

/* biome-ignore lint: code needs to be refactored */
function convertToFrame(json) {
  return {
    fid: json.fid,
    url: json.frameActionBody?.url.toString(),
    messageHash: json.messageHash,
    timestamp: json.timestamp,
    network: json.network,
    buttonIndex: json.frameActionBody?.buttonIndex,
    castId: {
      fid: json.frameActionBody?.castId?.fid,
      hash: json.frameActionBody?.castId?.hash
    }
  };
}

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Settings to simulate statuses on mock frames.
 *
 * Note: exported as public Type
 */

/**
 * A mock frame request payload
 *
 * Note: exported as public Type
 */

export { convertToFrame };
//# sourceMappingURL=types.js.map
