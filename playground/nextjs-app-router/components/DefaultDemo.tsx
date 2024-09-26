export default function DefaultDemo() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-center text-5xl lg:text-6xl font-medium tracking-[-0.1rem]">
        OnchainKit
      </h1>
      <p className="text-center text-2xl max-w-2xl mt-4 font-light">
        Build your onchain apps with ready-to-use React components and
        Typescript utilities.
      </p>

      <a 
      target="_blank"
      rel="noreferrer"
      title="View OnchainKit Docs"
      href="https://onchainkit.xyz/getting-started" 
      className="mt-6 px-6 py-3 rounded-lg p-2 border-2 border-primary hover:bg-primary hover:text-primary-foreground"> View Docs</a>
    </main>
  );
}
