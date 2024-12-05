import { FundButton, fetchOnrampConfig } from '@coinbase/onchainkit/fund';

export default function FundDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundButton />

      <button
        type="button"
        title="Test"
        onClick={() =>
          fetchOnrampConfig({ apiKey: 'tyKMoyBTbjeQpxfKIY1DYXMb3LRgT8J7' })
        }
      >
        {' '}
        Hello?{' '}
      </button>
    </div>
  );
}
