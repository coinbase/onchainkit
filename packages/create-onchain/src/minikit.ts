#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import {
  createClickableLink,
  isValidPackageName,
  toValidPackageName,
  copyDir,
} from './utils.js';
import open from 'open';
import express from 'express';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import { randomBytes, timingSafeEqual } from 'crypto';
import { WebSocketServer, WebSocket } from 'ws';
import { analyticsPrompt } from './analytics.js';

type WebpageData = {
  header: string;
  payload: string;
  signature: string;
  domain: string;
};

const MANIFEST_PORT = 3333;

// Bind to loopback only. Binding to every interface exposes the manifest
// generator to any host on the local network.
//
// This must be a literal address rather than `localhost`. `localhost` can
// resolve to either `::1` or `127.0.0.1`, so the browser could be sent to a
// different process than the one this CLI bound, and that process would then
// hold the session token below.
const MANIFEST_HOST = '127.0.0.1';
const MANIFEST_ORIGIN = `http://${MANIFEST_HOST}:${MANIFEST_PORT}`;

// The generator base64url-encodes each field, so the alphabet is fixed and
// contains no character that can terminate a string literal.
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;

// RFC 3986 unreserved and reserved characters, minus `"`, `'`, `` ` ``, `\` and
// `$`. Those are legal in a URL but would let the value escape the quoted
// value written to `.env`, or be expanded by a shell-style `.env` loader.
const DOMAIN_PATTERN = /^[A-Za-z0-9\-._~:/?#[\]@!&()*+,;=%]+$/;

// Smart-wallet signatures (ERC-6492 wrapped) can run to several kilobytes, so
// this is a denial-of-service guard rather than a format check. The character
// allowlists above are what prevent injection.
const MAX_FIELD_LENGTH = 64 * 1024;

// Generous enough for any legitimate account association, small enough that a
// local client cannot make the CLI buffer an unbounded message. The ws default
// is 100 MiB.
const MAX_MESSAGE_BYTES = 256 * 1024;

function isEqualToken(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function isAuthorizedRequest(
  origin: string | undefined,
  req: IncomingMessage,
  sessionToken: string,
): boolean {
  // Only the page this CLI serves may open a WebSocket. Without this check any
  // cross-origin page open in the developer's browser can connect, because the
  // same-origin policy does not apply to WebSockets. A browser always sends
  // `Origin` on a WebSocket handshake, so an absent value means the client is
  // not the page we served.
  if (origin !== MANIFEST_ORIGIN) {
    return false;
  }

  let requestUrl: URL;
  try {
    requestUrl = new URL(req.url ?? '/', MANIFEST_ORIGIN);
  } catch {
    return false;
  }

  return isEqualToken(requestUrl.searchParams.get('token') ?? '', sessionToken);
}

function parseBase64UrlField(name: string, value: unknown): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_FIELD_LENGTH ||
    !BASE64URL_PATTERN.test(value)
  ) {
    throw new Error(
      `Received an invalid "${name}" value from the manifest generator.`,
    );
  }
  return value;
}

function parseDomainField(value: unknown): string {
  const invalid = () =>
    new Error(
      'Received an invalid "domain" value from the manifest generator.',
    );

  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_FIELD_LENGTH ||
    !DOMAIN_PATTERN.test(value)
  ) {
    throw invalid();
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw invalid();
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw invalid();
  }

  // This becomes NEXT_PUBLIC_URL, which the app concatenates onto to build the
  // manifest's homeUrl, webhookUrl and iconUrl. Credentials, a query or a
  // fragment either leak into a committed file or break that concatenation.
  if (url.username || url.password || url.search || url.hash) {
    throw invalid();
  }

  return value;
}

function parseWebpageData(raw: string): WebpageData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('The manifest generator sent malformed JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('The manifest generator sent an unexpected payload.');
  }

  const { header, payload, signature, domain } = parsed as Record<
    string,
    unknown
  >;

  return {
    header: parseBase64UrlField('header', header),
    payload: parseBase64UrlField('payload', payload),
    signature: parseBase64UrlField('signature', signature),
    domain: parseDomainField(domain),
  };
}

async function getWebpageData(): Promise<WebpageData> {
  const app = express();
  const server = createServer(app);

  // Single-use secret shared with the browser through the URL fragment below.
  // A fragment is never sent to any server, so only the page this CLI opened
  // can present it.
  const sessionToken = randomBytes(32).toString('base64url');

  const wss = new WebSocketServer({
    server,
    maxPayload: MAX_MESSAGE_BYTES,
    // `origin` is typed as `string` by @types/ws but is `req.headers.origin`,
    // which is absent for non-browser clients.
    verifyClient: ({
      origin,
      req,
    }: {
      origin: string | undefined;
      req: IncomingMessage;
    }) => isAuthorizedRequest(origin, req, sessionToken),
  });

  app.use(
    express.static(
      path.resolve(fileURLToPath(import.meta.url), '../../manifest'),
    ),
  );

  return new Promise((resolve, reject) => {
    let isSettled = false;

    // `server.close()` alone leaves upgraded WebSocket connections open, which
    // keeps the process alive for any caller that does not immediately exit.
    function settle(complete: () => void) {
      if (isSettled) {
        return;
      }
      isSettled = true;
      for (const client of wss.clients) {
        client.terminate();
      }
      wss.close();
      server.close();
      complete();
    }

    wss.on('connection', (ws: WebSocket) => {
      // Without this listener a protocol-level failure, such as a frame over
      // `maxPayload`, is an unhandled 'error' event and terminates the process.
      ws.on('error', (error: Error) => settle(() => reject(error)));

      ws.on('message', (data: Buffer) => {
        try {
          const webpageData = parseWebpageData(data.toString());
          settle(() => resolve(webpageData));
        } catch (error) {
          settle(() => reject(error));
        }
      });
    });

    wss.on('error', (error: Error) => settle(() => reject(error)));
    server.on('error', (error: Error) => settle(() => reject(error)));

    server.listen(MANIFEST_PORT, MANIFEST_HOST, () => {
      const pageUrl = `${MANIFEST_ORIGIN}/#token=${sessionToken}`;
      Promise.resolve(open(pageUrl)).catch(() => {
        console.log(
          pc.yellow(
            `\n* Could not open a browser automatically. Open this URL to continue:\n  ${pageUrl}`,
          ),
        );
      });
    });
  });
}

export async function createMiniKitManifest(envPath?: string) {
  if (!envPath) {
    envPath = path.join(process.cwd(), '.env');
  }

  const existingEnv = await fs.promises
    .readFile(envPath, 'utf-8')
    .catch(() => null);
  if (!existingEnv) {
    console.log(
      pc.red(
        '\n* Failed to read .env file. Please ensure you are in your project directory.',
      ),
    );
    return false;
  }

  // Check if minikit.config.ts exists
  const configPath = path.join(process.cwd(), 'minikit.config.ts');
  const configExists = await fs.promises
    .access(configPath)
    .then(() => true)
    .catch(() => false);

  if (!configExists) {
    console.log(
      pc.red(
        '\n* Failed to find minikit.config.ts. Please ensure you are in your project directory.',
      ),
    );
    return false;
  }

  try {
    const webpageData = await getWebpageData();

    // Update NEXT_PUBLIC_URL in .env file. Every value below is written with
    // JSON.stringify so it stays inside its string literal even if validation
    // is ever relaxed. minikit.config.ts is executed by the scaffolded app, so
    // a value that escapes its literal is arbitrary code execution.
    const updatedEnv = existingEnv
      .split('\n')
      .map((line) => {
        if (line.startsWith('NEXT_PUBLIC_URL=')) {
          return `NEXT_PUBLIC_URL=${JSON.stringify(webpageData.domain)}`;
        }
        return line;
      })
      .join('\n');

    await fs.promises.writeFile(envPath, updatedEnv);

    // Update minikit.config.ts with account association. The replacements are
    // functions so that `$` sequences in the value are not treated as
    // String.prototype.replace substitution patterns.
    const configContent = await fs.promises.readFile(configPath, 'utf-8');
    const updatedConfig = configContent
      .replace(
        /header: ".*"/,
        () => `header: ${JSON.stringify(webpageData.header)}`,
      )
      .replace(
        /payload: ".*"/,
        () => `payload: ${JSON.stringify(webpageData.payload)}`,
      )
      .replace(
        /signature: ".*"/,
        () => `signature: ${JSON.stringify(webpageData.signature)}`,
      );

    await fs.promises.writeFile(configPath, updatedConfig);

    console.log(
      pc.blue(
        '\n* Account association generated successfully and added to your minikit.config.ts file!',
      ),
    );
  } catch (error) {
    console.log(
      pc.red('\n* Failed to generate account association. Please try again.'),
    );
    if (error instanceof Error && error.message) {
      console.log(pc.red(`  ${error.message}`));
    }
    return false;
  }

  return true;
}

export async function createMiniKitTemplate(
  template: 'minikit-nextjs' = 'minikit-nextjs',
) {
  console.log(
    `${pc.greenBright(`
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                             //
    //         :::   :::   ::::::::::: ::::    ::: ::::::::::: :::    ::: ::::::::::: :::::::::::  //
    //        :+:+: :+:+:      :+:     :+:+:   :+:     :+:     :+:   :+:      :+:         :+:      //
    //       +:+ +:+:+ +:+    +:+     :+:+:+  +:+     +:+     +:+  +:+       +:+         +:+       //
    //      +#+  +:+  +#+    +#+     +#+ +:+ +#+     +#+     +#++:++        +#+         +#+        //
    //     +#+       +#+    +#+     +#+  +#+#+#     +#+     +#+  +#+       +#+         +#+         //
    //    #+#       #+#    #+#     #+#   #+#+#     #+#     #+#   #+#      #+#         #+#          //
    //   ###       ###  ########  ###    ####   ########  ###    ###   ########      ###           //
    //                                                                                             //
    //                                                                     Powered by OnchainKit   //
    /////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`,
  );

  const defaultProjectName = 'my-minikit-app';

  let result: prompts.Answers<'projectName' | 'packageName' | 'clientKey'>;

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: pc.reset('Project name:'),
          initial: defaultProjectName,
          onState: (state) => {
            state.value = state.value.trim();
          },
          validate: (value) => {
            const targetDir = path.join(process.cwd(), value);
            if (
              fs.existsSync(targetDir) &&
              fs.readdirSync(targetDir).length > 0
            ) {
              return 'Directory already exists and is not empty. Please choose a different name.';
            }
            return true;
          },
        },
        {
          type: (_, { projectName }: { projectName: string }) =>
            isValidPackageName(projectName) ? null : 'text',
          name: 'packageName',
          message: pc.reset('Package name:'),
          initial: (_, { projectName }: { projectName: string }) =>
            toValidPackageName(projectName),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'password',
          name: 'clientKey',
          message: pc.reset(
            `Enter your ${createClickableLink(
              'Coinbase Developer Platform Client API Key:',
              'https://portal.cdp.coinbase.com/products/onchainkit',
            )} (optional)`,
          ),
        },
      ],
      {
        onCancel: () => {
          console.log('\nProject creation cancelled.');
          process.exit(0);
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { projectName, packageName, clientKey } = result;
  const root = path.join(process.cwd(), projectName);

  await analyticsPrompt(template);

  const spinner = ora(`Creating ${projectName}...`).start();

  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url),
    `../../../templates/${template}`,
  );

  await copyDir(sourceDir, root);
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
  pkg.name = packageName || toValidPackageName(projectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create .env file from template
  const envPath = path.join(root, '.env');
  await fs.promises.writeFile(
    envPath,
    `NEXT_PUBLIC_PROJECT_NAME="${projectName}"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="${clientKey}"
NEXT_PUBLIC_URL=""
`,
  );

  // Update minikit.config.ts with project name
  const configPath = path.join(root, 'minikit.config.ts');
  const configContent = await fs.promises.readFile(configPath, 'utf-8');
  const updatedConfig = configContent.replace(
    'name: "APP_NAME"',
    `name: "${projectName}"`,
  );
  await fs.promises.writeFile(configPath, updatedConfig);

  spinner.succeed();

  console.log(`\n\n${pc.magenta(`Created new MiniKit project in ${root}`)}\n`);

  logMiniKitSetupSummary(projectName, root, clientKey);
}

function logMiniKitSetupSummary(
  projectName: string,
  root: string,
  clientKey: string,
) {
  console.log(`\nIntegrations:`);

  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`MiniKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`OnchainKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (clientKey) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Coinbase Developer Platform`,
      )}`,
    );
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Paymaster`)}`);
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- Wagmi')}`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- ESLint')}`);

  const codeColor = (str: string) => pc.bgBlack(pc.green(str));

  [
    `\nTo get started with ${pc.green(projectName)}, run the following commands:\n`,
    root !== process.cwd()
      ? `- ${codeColor(`cd ${path.relative(process.cwd(), root)}`)}`
      : '',
    `- ${codeColor('npm install')}`,
    `- ${codeColor('npm run dev')}`,
    '\nBefore launching your app:',
    '\n- Set up account manifest',
    '  - Required for app discovery, notifications, and client integration',
    `  - Run ${codeColor('npx create-onchain --manifest')} from project root`,
    '- Configure your app details',
    '  - Update minikit.config.ts with your app information',
    '  - Set NEXT_PUBLIC_URL in .env to your deployment URL',
  ]
    .filter(Boolean)
    .forEach((line) => {
      console.log(line);
    });
}
