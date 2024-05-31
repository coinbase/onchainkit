import { CSSProperties, ReactNode } from 'react';

const style = {
  background: 'white',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  paddingBottom: '24px',
  height: '100%',
} as CSSProperties;

type PanelReact = {
  children: ReactNode;
};

export function Panel({ children }: PanelReact) {
  return <div style={style}>{children}</div>;
}
