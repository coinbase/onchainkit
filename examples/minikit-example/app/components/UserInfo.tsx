import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";

function useUserInfo() {
  const { isInMiniApp } = useIsInMiniApp();
  console.log("isInMiniApp", isInMiniApp);

  return useQuery({
    queryKey: ["useQuickAuth", isInMiniApp],
    queryFn: async () => {
      if (!isInMiniApp) {
        console.log("not in mini app");
        return null;
      }

      console.log("fetching user info");
      const result = await sdk.quickAuth.fetch("/me");
      console.log("result", result);
      return result;
    },
  });
}

export function UserInfo() {
  const { data } = useUserInfo();
  if (!data) return null;
  return (
    <div>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
