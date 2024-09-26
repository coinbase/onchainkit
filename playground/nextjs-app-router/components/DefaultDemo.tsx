export default function DefaultDemo() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='text-center font-medium text-5xl tracking-[-0.1rem] lg:text-6xl'>
        OnchainKit
      </h1>
      <p className='mt-4 max-w-2xl text-center font-light text-2xl'>
        Build your onchain apps with ready-to-use React components and
        Typescript utilities.
      </p>

      <a 
      target="_blank"
      rel="noreferrer"
      title="View OnchainKit Docs"
      href="https://onchainkit.xyz/getting-started" 
      className='mt-6 rounded-lg border-2 border-primary p-2 px-6 py-3 hover:bg-primary hover:text-primary-foreground'> View Docs</a>
    </main>
  );
}
