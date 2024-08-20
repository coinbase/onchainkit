import { Sandpack } from "@codesandbox/sandpack-react";
import {OnchainKitProvidersFile, transactionAppFile, transactionButtonFile, transactionconstantsFile, wagmiFile} from "../../../generated/sandpackFiles.ts";

export default function TransactionButton() {
  return (
    <Sandpack
      template="react-ts"
      customSetup={{
        dependencies: {
          "@coinbase/onchainkit": "latest",
        },
      }}
      files={{
        "/App.tsx": transactionAppFile,
        "/Button.tsx": transactionButtonFile,
        "/constants.ts": transactionconstantsFile,
        "/wagmi.ts": wagmiFile,
        "/OnchainKitProviders.tsx": OnchainKitProvidersFile,
      }}
      options={{
        layout: "preview",
        editorHeight: 600,
        editorWidthPercentage: 65, 
        activeFile: "/Button.tsx",
      }}
    />
  );
}
