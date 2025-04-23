import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import Page from './components/Page';

function App() {
  return (
    <OnchainKitProvider
      chain={base}
      config={{
        appearance: {
          name: 'Mini-App Manifest Generator',
          logo: 'https://pbs.twimg.com/media/GkXUnEnaoAIkKvG?format=jpg&name=medium',
          mode: 'auto',
          theme: 'base',
        },
        wallet: {
          display: 'modal',
        },
      }}
    >
      <Page />
    </OnchainKitProvider>
  );
}

export default App;
