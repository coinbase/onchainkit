var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/frame/utils/setFrameHtmlButtons.ts
function setFrameHtmlButtons(buttons) {
  if (!buttons) {
    return "";
  }
  return buttons.map((button, index) => {
    let buttonHtml = `  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />
`;
    if (button.action) {
      buttonHtml += `  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />
`;
    }
    if (button.target) {
      buttonHtml += `  <meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />
`;
    }
    if (button.action && (button.action === "tx" || button.action === "post") && button.postUrl) {
      buttonHtml += `  <meta property="fc:frame:button:${index + 1}:post_url" content="${button.postUrl}" />
`;
    }
    return buttonHtml;
  }).join("");
}
__name(setFrameHtmlButtons, "setFrameHtmlButtons");

// src/frame/utils/getFrameHtmlResponse.ts
function getFrameHtmlResponse({ accepts = {}, buttons, image, input, isOpenFrame = false, ogDescription, ogTitle, postUrl, post_url, refreshPeriod, refresh_period, state }) {
  const imgSrc = typeof image === "string" ? image : image.src;
  const ogImageHtml = `  <meta property="og:image" content="${imgSrc}" />
`;
  let imageHtml = `  <meta property="fc:frame:image" content="${imgSrc}" />
`;
  if (typeof image !== "string" && image.aspectRatio) {
    imageHtml += `  <meta property="fc:frame:image:aspect_ratio" content="${image.aspectRatio}" />
`;
  }
  const inputHtml = input ? `  <meta property="fc:frame:input:text" content="${input.text}" />
` : "";
  const stateHtml = state ? `  <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify(state))}" />
` : "";
  let buttonsHtml = "";
  if (buttons) {
    buttonsHtml = setFrameHtmlButtons(buttons);
  }
  const postUrlToUse = postUrl || post_url;
  const postUrlHtml = postUrlToUse ? `  <meta property="fc:frame:post_url" content="${postUrlToUse}" />
` : "";
  const refreshPeriodToUse = refreshPeriod || refresh_period;
  const refreshPeriodHtml = refreshPeriodToUse ? `  <meta property="fc:frame:refresh_period" content="${refreshPeriodToUse.toString()}" />
` : "";
  let ofHtml = "";
  if (isOpenFrame) {
    ofHtml = `  <meta property="of:version" content="vNext" />
`;
    const ofAcceptsHtml = Object.keys(accepts).map((protocolIdentifier) => {
      return `  <meta property="of:accepts:${protocolIdentifier}" content="${accepts[protocolIdentifier]}" />
`;
    }).join("");
    const ofImageHtml = `  <meta property="of:image" content="${imgSrc}" />
`;
    ofHtml += ofAcceptsHtml + ofImageHtml;
  }
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="${ogDescription || "Frame description"}" />
  <meta property="og:title" content="${ogTitle || "Frame title"}" />
  <meta property="fc:frame" content="vNext" />
${buttonsHtml}${ogImageHtml}${imageHtml}${inputHtml}${postUrlHtml}${refreshPeriodHtml}${stateHtml}${ofHtml}
</head>
</html>`;
  return html;
}
__name(getFrameHtmlResponse, "getFrameHtmlResponse");

// src/frame/utils/setFrameMetadataButtons.ts
function setFrameMetadataButtons(metadata, buttons) {
  if (!buttons) {
    return;
  }
  buttons.forEach((button, index) => {
    metadata[`fc:frame:button:${index + 1}`] = button.label;
    if (button.action) {
      metadata[`fc:frame:button:${index + 1}:action`] = button.action;
    }
    if (button.target) {
      metadata[`fc:frame:button:${index + 1}:target`] = button.target;
    }
    if (button.action && (button.action === "tx" || button.action === "post") && button.postUrl) {
      metadata[`fc:frame:button:${index + 1}:post_url`] = button.postUrl;
    }
  });
}
__name(setFrameMetadataButtons, "setFrameMetadataButtons");

// src/frame/utils/getFrameMetadata.ts
var getFrameMetadata = /* @__PURE__ */ __name(({ accepts = {}, buttons, image, input, isOpenFrame = false, postUrl, post_url, refreshPeriod, refresh_period, state }) => {
  const postUrlToUse = postUrl || post_url;
  const refreshPeriodToUse = refreshPeriod || refresh_period;
  const metadata = {
    "fc:frame": "vNext"
  };
  let imageSrc = "";
  if (typeof image === "string") {
    imageSrc = image;
  } else {
    imageSrc = image.src;
    if (image.aspectRatio) {
      metadata["fc:frame:image:aspect_ratio"] = image.aspectRatio;
    }
  }
  metadata["fc:frame:image"] = imageSrc;
  if (input) {
    metadata["fc:frame:input:text"] = input.text;
  }
  if (buttons) {
    setFrameMetadataButtons(metadata, buttons);
  }
  if (postUrlToUse) {
    metadata["fc:frame:post_url"] = postUrlToUse;
  }
  if (refreshPeriodToUse) {
    metadata["fc:frame:refresh_period"] = refreshPeriodToUse.toString();
  }
  if (state) {
    metadata["fc:frame:state"] = encodeURIComponent(JSON.stringify(state));
  }
  if (isOpenFrame) {
    metadata["of:version"] = "vNext";
    if (accepts) {
      Object.keys(accepts).forEach((protocolIdentifier) => {
        metadata[`of:accepts:${protocolIdentifier}`] = accepts[protocolIdentifier];
      });
    }
    metadata["of:image"] = imageSrc;
  }
  return metadata;
}, "getFrameMetadata");

// src/network/neynar/convertToNeynarResponseModel.ts
function convertToNeynarResponseModel(data) {
  if (!data) {
    return;
  }
  const neynarResponse = data;
  const action = neynarResponse.action;
  const cast = action?.cast;
  const interactor = action?.interactor;
  return {
    address: action?.address || null,
    button: action?.tapped_button?.index,
    following: action?.interactor?.viewer_context?.following,
    input: action?.input?.text,
    interactor: {
      fid: interactor?.fid,
      custody_address: interactor?.custody_address,
      verified_accounts: interactor?.verifications,
      verified_addresses: {
        eth_addresses: interactor?.verified_addresses?.eth_addresses,
        sol_addresses: interactor?.verified_addresses?.sol_addresses
      }
    },
    liked: cast?.viewer_context?.liked,
    raw: neynarResponse,
    recasted: cast?.viewer_context?.recasted,
    state: {
      serialized: action?.state?.serialized || ""
    },
    transaction: action?.transaction || null,
    valid: neynarResponse.valid
  };
}
__name(convertToNeynarResponseModel, "convertToNeynarResponseModel");

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

// src/network/neynar/postDataToNeynar.ts
async function postDataToNeynar(url, apiKey, data) {
  const options = {
    method: "POST",
    url,
    headers: {
      accept: "application/json",
      api_key: apiKey,
      "content-type": "application/json",
      onchainkit_version: version
    },
    body: JSON.stringify(data)
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  return await resp.json();
}
__name(postDataToNeynar, "postDataToNeynar");

// src/network/neynar/neynarFrameValidation.ts
var NEYNAR_DEFAULT_API_KEY = "NEYNAR_ONCHAIN_KIT";
async function neynarFrameValidation(messageBytes, apiKey = NEYNAR_DEFAULT_API_KEY, castReactionContext = true, followContext = true) {
  const url = "https://api.neynar.com/v2/farcaster/frame/validate";
  const responseBody = await postDataToNeynar(url, apiKey, {
    message_bytes_in_hex: messageBytes,
    cast_reaction_context: castReactionContext,
    follow_context: followContext
  });
  return convertToNeynarResponseModel(responseBody);
}
__name(neynarFrameValidation, "neynarFrameValidation");

// src/frame/utils/getFrameMessage.ts
async function getFrameMessage(body, messageOptions) {
  if (messageOptions?.allowFramegear) {
    if (body.mockFrameData) {
      return {
        isValid: true,
        message: body.mockFrameData
      };
    }
  }
  const response = await neynarFrameValidation(body?.trustedData?.messageBytes, messageOptions?.neynarApiKey || NEYNAR_DEFAULT_API_KEY, messageOptions?.castReactionContext || true, messageOptions?.followContext || true);
  if (response?.valid) {
    return {
      isValid: true,
      message: response
    };
  }
  return {
    isValid: false,
    message: void 0
  };
}
__name(getFrameMessage, "getFrameMessage");

// src/frame/utils/getMockFrameRequest.ts
function getMockFrameRequest(request, options) {
  return {
    ...request,
    mockFrameData: {
      address: null,
      button: request.untrustedData.buttonIndex,
      following: !!options?.following,
      input: request.untrustedData.inputText,
      interactor: {
        fid: options?.interactor?.fid || 0,
        custody_address: options?.interactor?.custody_address || "0xnotarealaddress",
        verified_accounts: options?.interactor?.verified_accounts || [],
        verified_addresses: {
          eth_addresses: null,
          sol_addresses: null
        }
      },
      liked: !!options?.liked,
      recasted: !!options?.recasted,
      state: {
        serialized: request.untrustedData.state || ""
      },
      transaction: null,
      valid: true,
      raw: {
        valid: true,
        /* biome-ignore lint: code needs to be refactored */
        action: {}
      }
    }
  };
}
__name(getMockFrameRequest, "getMockFrameRequest");
export {
  getFrameHtmlResponse,
  getFrameMessage,
  getFrameMetadata,
  getMockFrameRequest
};
//# sourceMappingURL=index.js.map