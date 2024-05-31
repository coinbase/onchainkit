import { CSSProperties, useMemo, useState } from 'react';
import { Token, TokenSelectorReact } from '../types';
import { TokenChip } from './TokenChip';
import { TokenRow } from './TokenRow';
import { TextInput } from './TextInput';
import { CloseIcon } from './CloseIcon';
import { Panel } from './Panel';

const styles = {
  header: {
    padding: '24px 20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '1.4',
    color: '#191D26',
  },
  tokenPills: {
    display: 'flex',
    gap: '8px',
  },
  content: {
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  label: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#5B616E',
    padding: '0 0 0 20px',
  },
  tokenList: {
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  overflowY: {
    overflowY: 'auto',
    scrollbarColor: 'rgba(91, 97, 110, 0.66) transparent',
    scrollbarWidth: 'thin',
  },
} as Record<string, CSSProperties>;

export function useFilteredTokens(tokens: Token[], value: string) {
  return useMemo(
    () =>
      tokens.filter(({ name, symbol, address }) => {
        const v = value.toLowerCase();
        return (
          name.toLowerCase().includes(v) ||
          symbol.toLowerCase().includes(v) ||
          address.toLowerCase().includes(v)
        );
      }),
    [value, tokens],
  );
}

export function TokenSelector({ onSelect, tokens, onClose }: TokenSelectorReact) {
  const [value, setValue] = useState('');
  const filteredTokens = useFilteredTokens(tokens, value);
  return (
    <Panel>
      <div style={styles.header}>
        <div style={styles.title}>Select a token</div>
        <CloseIcon onClick={onClose} />
      </div>
      <div style={styles.content}>
        <TextInput placeholder="Search name or paste address" value={value} onChange={setValue} />
        {filteredTokens.length > 0 && (
          <div data-testid="ockTokenSelector_TokenChips" style={styles.tokenPills}>
            {filteredTokens.map((token) => (
              <TokenChip key={token.name} token={token} onClick={onSelect} />
            ))}
          </div>
        )}
      </div>
      {filteredTokens.length > 0 ? (
        <div style={styles.overflowY}>
          <div style={styles.label}>Tokens</div>
          <div data-testid="ockTokenSelector_TokenList" style={styles.tokenList}>
            {filteredTokens.map((token) => (
              <TokenRow key={token.name} token={token} onClick={onSelect} />
            ))}
          </div>
        </div>
      ) : (
        <div data-testid="ockTokenSelector_NoResult" style={styles.label}>
          No tokens found
        </div>
      )}
    </Panel>
  );
}
