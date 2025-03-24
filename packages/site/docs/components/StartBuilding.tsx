export default function StartBuilding() {
  return (
    <>
      <h1 className="vocs_H2 vocs_Heading">Start building!</h1>
      <div>Explore our ready-to-use onchain components:</div>
      <ul className="vocs_List vocs_List_unordered">
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/identity/identity"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Identity</code>
              </strong>
            </a>{' '}
            - Show{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/identity/name"
            >
              Basenames
            </a>
            ,{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/identity/avatar"
            >
              avatars
            </a>
            ,{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/identity/badge"
            >
              badges
            </a>
            , and{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/identity/address"
            >
              addresses
            </a>
            .
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/wallet/wallet"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Wallet</code>
              </strong>
            </a>{' '}
            - Create or connect wallets with{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/wallet/wallet"
            >
              Connect Wallet
            </a>
            .
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/transaction/transaction"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Transaction</code>
              </strong>
            </a>{' '}
            - Handle{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/transaction/transaction"
            >
              transactions
            </a>{' '}
            using EOAs or Smart Wallets.
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/checkout/checkout"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Checkout</code>
              </strong>
            </a>{' '}
            - Integrate USDC{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/checkout/checkout"
            >
              checkout
            </a>{' '}
            flows with ease.
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/fund/fund-button"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Fund</code>
              </strong>
            </a>{' '}
            - Create a{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/fund/fund-button"
            >
              funding
            </a>{' '}
            flow to onboard users.
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/token/token-chip"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Tokens</code>
              </strong>
            </a>{' '}
            - Search and display{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/token/token-chip"
            >
              tokens
            </a>{' '}
            with various components.
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/swap/swap"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Swap</code>
              </strong>
            </a>{' '}
            - Enable{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/swap/swap"
            >
              token swaps
            </a>{' '}
            in your app.
          </span>
        </li>
        <li className="vocs_ListItem">
          <span>
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/mint/nft-mint-card"
            >
              <strong className="vocs_Strong">
                <code className="vocs_Code">Mint</code>
              </strong>
            </a>{' '}
            -{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/mint/nft-card"
            >
              View
            </a>{' '}
            and{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/mint/nft-mint-card"
            >
              Mint
            </a>{' '}
            NFTs in your app.
          </span>
        </li>
      </ul>
    </>
  );
}
