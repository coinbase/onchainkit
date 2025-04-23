import prompts from "prompts";
import pc from 'picocolors';

const ANALYTICS_API_URL = 'https://api.developer.coinbase.com/analytics';

type AnalyticsPayload = {
  eventType: 'createOnchainInitiated';
  timestamp: number;
  data: {
    template: 'minikit-basic' | 'minikit-snake' | 'onchainkit';
  };
};

async function sendAnalytics(
  template: AnalyticsPayload['data']['template'],
) {
  const timestamp = Date.now();
  const payload: AnalyticsPayload = {
    eventType: 'createOnchainInitiated',
    timestamp,
    data: {
      template,
    },
  };

  fetch(ANALYTICS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .catch(() => {});
}

export async function analyticsPrompt(template: AnalyticsPayload['data']['template']) {
  let analyticsResult: prompts.Answers<'analytics'>;
  try {
    analyticsResult = await prompts(
      [
        {
          type: 'toggle',
          name: 'analytics',
          message: pc.reset('Share anonymous usage data to help improve create-onchain?'),
          initial: true,
          active: 'yes',
          inactive: 'no',
        },
      ],
      {
        onCancel: () => {
          return false;
        },
      },
    );
  } catch {
    return false;
  }

  const { analytics } = analyticsResult;
  if (analytics) {
    sendAnalytics(template);
  }

  return analytics;
}
