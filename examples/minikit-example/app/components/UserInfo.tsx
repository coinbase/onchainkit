import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";

function useUserInfo() {
  const { isInMiniApp } = useIsInMiniApp();

  return useQuery({
    queryKey: ["useQuickAuth"],
    queryFn: async () => {
      console.log("fetching user info");
      const result = await sdk.quickAuth.fetch("/me");
      console.log("result", result);
      return result;
    },
    enabled: isInMiniApp,
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
