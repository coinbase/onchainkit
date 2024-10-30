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
              Identity
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
              Wallet
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
              Transaction
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
              Checkout
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
              Fund
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
              Tokens
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
              Swap
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
              Frame
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
