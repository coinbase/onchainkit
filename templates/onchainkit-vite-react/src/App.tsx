import './App.css';
import { Wallet } from '@coinbase/onchainkit/wallet';
import sphereLogo from './assets/sphere.svg';
import { RootProvider } from './RootProvider';

export default function App() {
  return (
    <RootProvider>
      <div className="container">
        <header className="headerWrapper">
          <Wallet />
        </header>

        <div className="content">
          <img src={sphereLogo} alt="Sphere" width={200} height={200} />
          <h1 className="title">OnchainKit</h1>

          <p>
            Get started by editing <code>src/App.tsx</code>
          </p>

          <h2 className="componentsTitle">Explore Components</h2>

          <ul className="components">
            {[
              {
                name: 'Transaction',
                url: 'https://docs.base.org/onchainkit/transaction/transaction',
              },
              {
                name: 'Swap',
                url: 'https://docs.base.org/onchainkit/swap/swap',
              },
              {
                name: 'Checkout',
                url: 'https://docs.base.org/onchainkit/checkout/checkout',
              },
              {
                name: 'Wallet',
                url: 'https://docs.base.org/onchainkit/wallet/wallet',
              },
              {
                name: 'Identity',
                url: 'https://docs.base.org/onchainkit/identity/identity',
              },
            ].map((component) => (
              <li key={component.name}>
                <a target="_blank" rel="noreferrer" href={component.url}>
                  {component.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RootProvider>
  );
}
