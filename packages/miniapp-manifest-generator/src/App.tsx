import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import GenerateManifest from './GenerateManifest';
import ValidateManifest from './ValidateManifest';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function Root() {
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
      <Outlet />
    </OnchainKitProvider>
  );
}

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GenerateManifest,
});

const validateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/validate',
  component: ValidateManifest,
});

const routeTree = rootRoute.addChildren([indexRoute, validateRoute]);
const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
