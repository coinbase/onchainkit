import React from 'react';
import { codeToTokens, type ThemedToken } from 'shiki';

export async function getHighlightedCode({ code, theme }: { code: string, theme: string }) {
  const highlightedCode = await codeToTokens(code, {
    lang: 'typescript',
    themes: {
      light: theme === 'dark' ? 'dark-plus' : 'catppuccin-latte',
    },
  })

  return (
    <code>
      {highlightedCode?.tokens.map((line, i) => (
        <div key={i}>
          {line.map((token, j) => (
            <Token key={j} token={token} />
          ))}
        </div>
      ))}
    </code>
  )
}

const Token = ({ token }: { token: ThemedToken }) => {
  if (Array.isArray(token.content)) {
    return (
      <span style={token.htmlStyle as Record<string, string>}>
        {token.content.map((subToken, i) => (
          <Token key={i} token={subToken} />
        ))}
      </span>
    );
  }
  
  if (token.content.includes('\n')) {
    return token.content.split('\n').map((part, i, arr) => (
      <React.Fragment key={i}>
        <span style={token.htmlStyle as Record<string, string>}>{part}</span>
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  return <span style={token.htmlStyle as Record<string, string>}>{token.content}</span>;
};