let MediaType = /*#__PURE__*/function (MediaType) {
  MediaType["Image"] = "image";
  MediaType["Video"] = "video";
  MediaType["Audio"] = "audio";
  MediaType["Unknown"] = "unknown";
  return MediaType;
}({});

/* Lifecycle Provider */

let LifecycleType = /*#__PURE__*/function (LifecycleType) {
  LifecycleType["VIEW"] = "view";
  LifecycleType["MINT"] = "mint";
  return LifecycleType;
}({});

/* NFT Provider */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 */

/**
 * Note: exported as public Type
 * NFTMint must be used if the NFTMintButton is included
 */

/**
 * Note: exported as public Type
 */

// make all keys in T optional if they are in K

// check if all keys in T are a key of LifecycleStatusDataShared

/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */

export { LifecycleType, MediaType };
//# sourceMappingURL=types.js.map
