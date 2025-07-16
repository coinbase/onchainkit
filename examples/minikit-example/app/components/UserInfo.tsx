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
        return {
          message: "Not in mini app",
        };
      }

      console.log("fetching user info");
      const result = await sdk.quickAuth.fetch("/api/me");
      const body = await result.json();
      console.log("result", body);
      return body;
    },
  });
}

export function UserInfo() {
  const { data } = useUserInfo();
  if (!data) return null;
  console.log("data", data);
  return (
    <div>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
