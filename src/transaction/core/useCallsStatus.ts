import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';

type UseCallsStatusParams = {
  transactionId: string;
};

export function useCallsStatus({ transactionId }: UseCallsStatusParams) {
  try {
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: (data) =>
          data.state.data?.status === 'CONFIRMED' ? false : 1000,
      },
    });

    const transactionHash = data?.receipts?.[0]?.transactionHash;

    return { status: data?.status, transactionHash };
  } catch (err) {
    console.log(`useCallsStatusError: ${err}`);
    return { status: 'error', transactionHash: undefined };
  }
}
