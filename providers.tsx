<OnchainKitProvider
  apiKey={process.env.ONCHAINKIT_API_KEY}
  chain={base}
  config={{
    appearance: {
      name: 'Your App Name',        // Displayed in modal header
      logo: 'https://your-logo.com',// Displayed in modal header
      mode: 'auto',                 // 'light' | 'dark' | 'auto'
      theme: 'default',             // 'default' or custom theme
    },
    // configure the wallet modal below 
    wallet: {
      display: 'modal',       
      termsUrl: 'https://...', 
      privacyUrl: 'https://...', 
    },
  }}
>
  {children}
</OnchainKitProvider>
