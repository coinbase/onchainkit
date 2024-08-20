import OnchainProviders from '../OnchainKitProviders.tsx'
import Button from './Button.tsx'
import '@coinbase/onchainkit/styles.css';
 
export default function App() {
  return (
    <OnchainProviders>
      <Button />
    </OnchainProviders> 
  )
}  