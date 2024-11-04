import { cn, border } from '../../styles/theme.js';
import { useName } from '../hooks/useName.js';
import { useSocials } from '../hooks/useSocials.js';
import { GetSocialPlatformDetails } from '../utils/getSocialPlatformDetails.js';
import { useIdentityContext } from './IdentityProvider.js';
import { jsx } from 'react/jsx-runtime';
function Socials({
  address,
  chain,
  className
}) {
  const _useIdentityContext = useIdentityContext(),
    contextAddress = _useIdentityContext.address,
    contextChain = _useIdentityContext.chain;
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error('Socials: an Ethereum address must be provided to the Socials component.');
    return null;
  }
  const _useName = useName({
      address: accountAddress,
      chain: accountChain
    }),
    name = _useName.data,
    isLoadingName = _useName.isLoading;
  const _useSocials = useSocials({
      ensName: name ?? '',
      chain: accountChain
    }, {
      enabled: !!name
    }),
    socials = _useSocials.data,
    isLoadingSocials = _useSocials.isLoading;
  if (isLoadingName || isLoadingSocials) {
    return /*#__PURE__*/jsx("span", {
      className: className
    });
  }
  if (!socials || Object.values(socials).every(value => !value)) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(border.default, 'mt-2 w-full pl-1', className),
    children: /*#__PURE__*/jsx("div", {
      className: 'left-4 flex space-x-2',
      children: Object.entries(socials).map(([platform, value]) => value && /*#__PURE__*/jsx(GetSocialPlatformDetails, {
        platform: platform,
        value: value
      }, platform))
    })
  });
}
export { Socials };
//# sourceMappingURL=Socials.js.map
