import type {
  Attestation,
  UseAttestations,
  UseQueryOptions,
} from '@/identity/types';
import { getAttestations } from '@/identity/utils/getAttestations';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetches EAS Attestations for a given address, chain, and schemaId.
 */
export function useAttestations(
  { address, chain, schemaId }: UseAttestations,
  queryOptions?: UseQueryOptions<Attestation[]>,
): Attestation[] {
  const result = useQuery<Attestation[]>({
    queryKey: ['useAttestations', address, chain?.id, schemaId],
    queryFn: async () => {
      return getAttestations(address, chain, { schemas: [schemaId!] });
    },
    enabled: !!address && !!schemaId,
    ...DEFAULT_QUERY_OPTIONS,
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });

  return result.data || [];
}
