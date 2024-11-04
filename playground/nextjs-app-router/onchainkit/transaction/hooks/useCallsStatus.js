import { useCallsStatus as useCallsStatus$1 } from 'wagmi/experimental';
function useCallsStatus({
  setLifecycleStatus,
  transactionId
}) {
  try {
    const _useCallsStatus$ = useCallsStatus$1({
        id: transactionId,
        query: {
          refetchInterval: query => {
            return query.state.data?.status === 'CONFIRMED' ? false : 1000;
          },
          enabled: !!transactionId
        }
      }),
      data = _useCallsStatus$.data;
    const transactionHash = data?.receipts?.[0]?.transactionHash;
    return {
      status: data?.status,
      transactionHash
    };
  } catch (err) {
    setLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'TmUCSh01',
        error: JSON.stringify(err),
        message: ''
      }
    });
    return {
      status: 'error',
      transactionHash: undefined
    };
  }
}
export { useCallsStatus };
//# sourceMappingURL=useCallsStatus.js.map
