import React from 'react';
import { type ThemedToken, codeToTokens } from 'shiki';

export async function getHighlightedCode({
  code,
  theme,
}: {
  code: string;
  theme: string;
}) {
  const highlightedCode = await codeToTokens(code, {
    lang: 'typescript',
    themes: {
      light: theme === 'dark' ? 'dark-plus' : 'catppuccin-latte',
    },
  });

  return (
    <code>
      {highlightedCode?.tokens.map((line, i) => {
        if (line.length === 0) {
          return <br />;
        }

        return (
          <div key={`${i}|${line[0]?.offset}`}>
            {line.map((token, j) => (
              <HtmlToken key={`${j}|${token.content}`} token={token} />
            ))}
          </div>
        );
      })}
    </code>
  );
}

function HtmlToken({ token }: { token: ThemedToken }) {
  const sanitizedHtmlStyle = sanitizeHtmlStyle(
    token.htmlStyle as Record<string, string>,
  );

  if (Array.isArray(token.content)) {
    return (
      <span style={sanitizedHtmlStyle}>
        {token.content.map((subToken) => (
          <HtmlToken key={subToken} token={subToken} />
        ))}
      </span>
    );
  }

  if (token.content.includes('\n')) {
    return token.content.split('\n').map((part, i, arr) => (
      <React.Fragment key={part}>
        <span style={sanitizedHtmlStyle}>{part}</span>
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  return <span style={sanitizedHtmlStyle}>{token.content}</span>;
}

function sanitizeHtmlStyle(style: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ]),
  );
}
