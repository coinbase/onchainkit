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
              <code className="vocs_Code">Identity</code>
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
              <code className="vocs_Code">Wallet</code>
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
              <code className="vocs_Code">Transaction</code>
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
              <code className="vocs_Code">Checkout</code>
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
              <code className="vocs_Code">Fund</code>
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
              <code className="vocs_Code">Tokens</code>
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
              <code className="vocs_Code">Swap</code>
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
              href="/frame/frame-metadata"
            >
              <code className="vocs_Code">Frame</code>
            </a>{' '}
            - Build and test{' '}
            <a
              className="vocs_Anchor vocs_Link vocs_Link_accent_underlined"
              href="/frame/frame-metadata"
            >
              Farcaster
            </a>{' '}
            frames.
          </span>
        </li>
      </ul>
    </>
  );
}
