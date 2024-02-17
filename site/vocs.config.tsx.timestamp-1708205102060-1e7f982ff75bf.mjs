// vocs.config.tsx
import { FrameMetadata } from "file:///Users/zizzamia/src/base/onchainkit/site/node_modules/@coinbase/onchainkit/lib/index.js";
import { defineConfig } from "file:///Users/zizzamia/src/base/onchainkit/site/node_modules/vocs/_lib/index.js";

// sidebar.ts
var sidebar = {
  "/docs/": [
    {
      text: "Introduction",
      items: [
        { text: "Why Onchainkit", link: "/docs/introduction" },
        { text: "Getting Started", link: "/docs/getting-started" }
      ]
    },
    {
      text: "Frame Kit",
      items: [
        { text: "Introduction", link: "/docs/framekit/intro" },
        {
          text: "Components",
          items: [
            {
              text: "FrameMetadata",
              link: "/docs/framekit/components/framemetadata"
            }
          ]
        }
      ]
    }
  ]
};

// vocs.config.tsx
import { Fragment, jsx, jsxs } from "file:///Users/zizzamia/src/base/onchainkit/site/node_modules/react/jsx-runtime.js";
var GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "TEST_GA";
var ONCHAINKIT_TITLE = "OnchainKit";
var ONCHAINKIT_DESCRIPTION = `A collection of tools to build world-class onchain 
apps with CSS, React, and Typescript.`;
var vocs_config_default = defineConfig({
  baseUrl: "https://onchainkit.xyz",
  title: ONCHAINKIT_TITLE,
  titleTemplate: "%s \xB7 OnchainKit",
  description: ONCHAINKIT_DESCRIPTION,
  head: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FrameMetadata,
      {
        image: {
          src: "https://onchainkit.xyz/logo/"
        },
        ogTitle: ONCHAINKIT_TITLE,
        ogDescription: ONCHAINKIT_DESCRIPTION
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
        async: true,
        defer: true
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        id: "gtag-init",
        dangerouslySetInnerHTML: {
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `
        }
      }
    )
  ] }),
  sidebar,
  socials: [
    {
      icon: "github",
      link: "https://github.com/coinbase/onchainkit"
    }
  ],
  theme: {
    accentColor: {
      light: "#d76260d9",
      dark: "#ce6170d9"
    }
  },
  topNav: [
    { text: "Docs", link: "/docs/getting-started", match: "/docs" },
    {
      text: "Frame Example",
      link: "https://github.com/Zizzamia/a-frame-in-100-lines"
    },
    {
      text: pkg.version,
      items: [
        {
          text: `Migrating to ${toPatchVersionRange(pkg.version)}`,
          link: `/docs/migration-guide#_${toPatchVersionRange(
            pkg.version
          ).replace(/\./g, "-")}-breaking-changes`
        },
        {
          text: "Changelog",
          link: "https://github.com/wevm/viem/blob/main/src/CHANGELOG.md"
        },
        {
          text: "Contributing",
          link: "https://github.com/wevm/viem/blob/main/.github/CONTRIBUTING.md"
        }
      ]
    }
  ]
});
export {
  GOOGLE_ANALYTICS_ID,
  vocs_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHN4IiwgInNpZGViYXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEZyYW1lTWV0YWRhdGEgfSBmcm9tICdAY29pbmJhc2Uvb25jaGFpbmtpdCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2b2NzJztcbmltcG9ydCB7IHNpZGViYXIgfSBmcm9tICcuL3NpZGViYXInO1xuXG5leHBvcnQgY29uc3QgR09PR0xFX0FOQUxZVElDU19JRCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0dPT0dMRV9BTkFMWVRJQ1NfSUQgPz8gJ1RFU1RfR0EnO1xuXG5jb25zdCBPTkNIQUlOS0lUX1RJVExFID0gJ09uY2hhaW5LaXQnO1xuY29uc3QgT05DSEFJTktJVF9ERVNDUklQVElPTiA9IGBBIGNvbGxlY3Rpb24gb2YgdG9vbHMgdG8gYnVpbGQgd29ybGQtY2xhc3Mgb25jaGFpbiBcbmFwcHMgd2l0aCBDU1MsIFJlYWN0LCBhbmQgVHlwZXNjcmlwdC5gO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlVXJsOiAnaHR0cHM6Ly9vbmNoYWlua2l0Lnh5eicsXG4gIHRpdGxlOiBPTkNIQUlOS0lUX1RJVExFLFxuICB0aXRsZVRlbXBsYXRlOiAnJXMgXHUwMEI3IE9uY2hhaW5LaXQnLFxuICBkZXNjcmlwdGlvbjogT05DSEFJTktJVF9ERVNDUklQVElPTixcbiAgaGVhZDogKFxuICAgICAgPD5cbiAgICAgICAgPEZyYW1lTWV0YWRhdGFcbiAgICAgICAgICBpbWFnZT17e1xuICAgICAgICAgICAgc3JjOiAnaHR0cHM6Ly9vbmNoYWlua2l0Lnh5ei9sb2dvLycsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvZ1RpdGxlPXtPTkNIQUlOS0lUX1RJVExFfVxuICAgICAgICAgIG9nRGVzY3JpcHRpb249e09OQ0hBSU5LSVRfREVTQ1JJUFRJT059XG4gICAgICAgIC8+XG4gICAgICAgIDxzY3JpcHRcbiAgICAgICAgICBzcmM9e2BodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndGFnL2pzP2lkPSR7R09PR0xFX0FOQUxZVElDU19JRH1gfVxuICAgICAgICAgIGFzeW5jXG4gICAgICAgICAgZGVmZXJcbiAgICAgICAgLz5cbiAgICAgICAgPHNjcmlwdFxuICAgICAgICAgIGlkPVwiZ3RhZy1pbml0XCJcbiAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICAgICAgX19odG1sOiBgXG4gICAgICAgICAgICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdO1xuICAgICAgICAgICAgICBmdW5jdGlvbiBndGFnKCl7ZGF0YUxheWVyLnB1c2goYXJndW1lbnRzKTt9XG4gICAgICAgICAgICAgIGd0YWcoJ2pzJywgbmV3IERhdGUoKSk7XG4gICAgICAgICAgICAgIGd0YWcoJ2NvbmZpZycsICcke0dPT0dMRV9BTkFMWVRJQ1NfSUR9Jyk7XG4gICAgICAgICAgICBgLFxuICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC8+XG4gICksXG4gIHNpZGViYXIsXG4gIHNvY2lhbHM6IFtcbiAgICB7XG4gICAgICBpY29uOiAnZ2l0aHViJyxcbiAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vY29pbmJhc2Uvb25jaGFpbmtpdCcsXG4gICAgfSxcbiAgXSxcbiAgdGhlbWU6IHtcbiAgICBhY2NlbnRDb2xvcjoge1xuICAgICAgbGlnaHQ6ICcjZDc2MjYwZDknLFxuICAgICAgZGFyazogJyNjZTYxNzBkOScsXG4gICAgfSxcbiAgfSxcbiAgdG9wTmF2OiBbXG4gICAgeyB0ZXh0OiAnRG9jcycsIGxpbms6ICcvZG9jcy9nZXR0aW5nLXN0YXJ0ZWQnLCBtYXRjaDogJy9kb2NzJyB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdGcmFtZSBFeGFtcGxlJyxcbiAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vWml6emFtaWEvYS1mcmFtZS1pbi0xMDAtbGluZXMnLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogcGtnLnZlcnNpb24sXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogYE1pZ3JhdGluZyB0byAke3RvUGF0Y2hWZXJzaW9uUmFuZ2UocGtnLnZlcnNpb24pfWAsXG4gICAgICAgICAgbGluazogYC9kb2NzL21pZ3JhdGlvbi1ndWlkZSNfJHt0b1BhdGNoVmVyc2lvblJhbmdlKFxuICAgICAgICAgICAgcGtnLnZlcnNpb24sXG4gICAgICAgICAgKS5yZXBsYWNlKC9cXC4vZywgJy0nKX0tYnJlYWtpbmctY2hhbmdlc2AsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnQ2hhbmdlbG9nJyxcbiAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL3dldm0vdmllbS9ibG9iL21haW4vc3JjL0NIQU5HRUxPRy5tZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnQ29udHJpYnV0aW5nJyxcbiAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL3dldm0vdmllbS9ibG9iL21haW4vLmdpdGh1Yi9DT05UUklCVVRJTkcubWQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ppenphbWlhL3NyYy9iYXNlL29uY2hhaW5raXQvc2l0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ppenphbWlhL3NyYy9iYXNlL29uY2hhaW5raXQvc2l0ZS9zaWRlYmFyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy96aXp6YW1pYS9zcmMvYmFzZS9vbmNoYWlua2l0L3NpdGUvc2lkZWJhci50c1wiO2ltcG9ydCB0eXBlIHsgU2lkZWJhciB9IGZyb20gJ3ZvY3MnO1xuXG5leHBvcnQgY29uc3Qgc2lkZWJhciA9IHtcbiAgJy9kb2NzLyc6IFtcbiAgICB7XG4gICAgICB0ZXh0OiAnSW50cm9kdWN0aW9uJyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ1doeSBPbmNoYWlua2l0JywgbGluazogJy9kb2NzL2ludHJvZHVjdGlvbicgfSxcbiAgICAgICAgeyB0ZXh0OiAnR2V0dGluZyBTdGFydGVkJywgbGluazogJy9kb2NzL2dldHRpbmctc3RhcnRlZCcgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnRnJhbWUgS2l0JyxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogJ0ludHJvZHVjdGlvbicsIGxpbms6ICcvZG9jcy9mcmFtZWtpdC9pbnRybycgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdDb21wb25lbnRzJyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnRnJhbWVNZXRhZGF0YScsXG4gICAgICAgICAgICAgIGxpbms6ICcvZG9jcy9mcmFtZWtpdC9jb21wb25lbnRzL2ZyYW1lbWV0YWRhdGEnLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH1cbiAgXVxufSBhcyBjb25zdCBzYXRpc2ZpZXMgU2lkZWJhcjtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjs7O0FDQ3RCLElBQU0sVUFBVTtBQUFBLEVBQ3JCLFVBQVU7QUFBQSxJQUNSO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxFQUFFLE1BQU0sa0JBQWtCLE1BQU0scUJBQXFCO0FBQUEsUUFDckQsRUFBRSxNQUFNLG1CQUFtQixNQUFNLHdCQUF3QjtBQUFBLE1BQzNEO0FBQUEsSUFDRjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLEVBQUUsTUFBTSxnQkFBZ0IsTUFBTSx1QkFBdUI7QUFBQSxRQUNyRDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEWE0sbUJBQ0UsS0FERjtBQVpDLElBQU0sc0JBQXNCLFFBQVEsSUFBSSxtQ0FBbUM7QUFFbEYsSUFBTSxtQkFBbUI7QUFDekIsSUFBTSx5QkFBeUI7QUFBQTtBQUcvQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsRUFDUCxlQUFlO0FBQUEsRUFDZixhQUFhO0FBQUEsRUFDYixNQUNJLGlDQUNFO0FBQUE7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLE9BQU87QUFBQSxVQUNMLEtBQUs7QUFBQSxRQUNQO0FBQUEsUUFDQSxTQUFTO0FBQUEsUUFDVCxlQUFlO0FBQUE7QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLEtBQUssK0NBQStDLG1CQUFtQjtBQUFBLFFBQ3ZFLE9BQUs7QUFBQSxRQUNMLE9BQUs7QUFBQTtBQUFBLElBQ1A7QUFBQSxJQUNBO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxJQUFHO0FBQUEsUUFDSCx5QkFBeUI7QUFBQSxVQUN2QixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0NBSVksbUJBQW1CO0FBQUE7QUFBQSxRQUUzQztBQUFBO0FBQUEsSUFDQTtBQUFBLEtBQ0Y7QUFBQSxFQUVKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxhQUFhO0FBQUEsTUFDWCxPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLEVBQUUsTUFBTSxRQUFRLE1BQU0seUJBQXlCLE9BQU8sUUFBUTtBQUFBLElBQzlEO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU0sSUFBSTtBQUFBLE1BQ1YsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU0sZ0JBQWdCLG9CQUFvQixJQUFJLE9BQU8sQ0FBQztBQUFBLFVBQ3RELE1BQU0sMEJBQTBCO0FBQUEsWUFDOUIsSUFBSTtBQUFBLFVBQ04sRUFBRSxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQUEsUUFDdkI7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
