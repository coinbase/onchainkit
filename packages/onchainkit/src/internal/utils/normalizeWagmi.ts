/**
 * These normalize functions are needed due to Wagmi's experimental hooks have a breaking change on a minor version
 * https://github.com/wevm/viem/blob/8621c73ac128605828a6b462c758e9c73b4567ed/src/CHANGELOG.md#2260
 *
 * We cannot dictate which version of viem wagmi uses, so we need to normalize the status and transaction id
 * to be compatible with both < v2.26.0 and >= v2.26.0
 */

export function normalizeStatus(status?: string) {
  if (status === 'CONFIRMED') {
    return 'success';
  }
  if (status === 'PENDING') {
    return 'pending';
  }

  return status;
}

export function normalizeTransactionId(data: { id: string } | string) {
  if (typeof data === 'string') {
    return data;
  }
  return data.id;
}
