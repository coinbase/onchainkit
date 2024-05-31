import { MagnifierIcon, CloseIcon } from './icons';

type IconOptions = 'magnifier' | 'close';

type IconSelectorReact = {
  icon: IconOptions;
};

function IconSelector({ icon }: IconSelectorReact) {
  switch (icon) {
    case 'close':
      return <CloseIcon />;
    case 'magnifier':
      return <MagnifierIcon />;
  }
}

type IconButtonReact = {
  icon: IconOptions;
  onClick: () => void;
};

export function IconButton({ icon, onClick }: IconButtonReact) {
  return (
    <button onClick={onClick}>
      <IconSelector icon={icon} />
    </button>
  );
}
