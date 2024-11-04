import { Address } from './Address.js';
import { Avatar } from './Avatar.js';
import { Badge } from './Badge.js';
import { Identity } from './Identity.js';
import { Name } from './Name.js';
import { Socials } from './Socials.js';
import { cn, border, background, line } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function IdentityCard({
  address,
  chain,
  className = '',
  schemaId
}) {
  return /*#__PURE__*/jsxs(Identity, {
    address: address,
    chain: chain,
    className: cn(border.radius, background.default, line.default, 'items-left flex min-w-[300px] p-4', className),
    schemaId: schemaId,
    children: [/*#__PURE__*/jsx(Avatar, {}), /*#__PURE__*/jsx(Name, {
      children: /*#__PURE__*/jsx(Badge, {})
    }), /*#__PURE__*/jsx(Address, {}), /*#__PURE__*/jsx(Socials, {})]
  });
}
export { IdentityCard };
//# sourceMappingURL=IdentityCard.js.map
