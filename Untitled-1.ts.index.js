import { Avatar } from '@coinbase/onchainkit/identity';
import { TokenRow } from '@coinbase/onchainkit/token';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

const address = "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9";
const token = {
      "address": "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
        "chainId": 8453,
          "decimals": 18,
            "image": "https://makerdao.com/images/logo.svg",
              "name": "Dai",
                "symbol": "DAI"
};

// Connect Wallet
// See https://onchainkit.xyz/wallet/wallet for docs!
<ConnectWallet />

// Identity
// See https://onchainkit.xyz/identity/address for docs!
<Avatar address={address} />;

// Token
// See https://onchainkit.xyz/token/token-row for docs!
<TokenRow token={token} />;
}