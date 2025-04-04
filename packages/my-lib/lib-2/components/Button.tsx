type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export function Button({ children, onClick }: Props) {
  return <button onClick={onClick}>{children}</button>;
}
