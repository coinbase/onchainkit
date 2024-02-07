import type { Address } from "viem";
import { AttestationSchema } from "./types";
import { getAttestation } from './getAttestation';
import { schemasToUids, client } from './attestation';


export async function hasVerifiedAttestations(
    address: Address,
    expectedSchemas: AttestationSchema[] = []
): Promise<boolean> {
    if (!address || expectedSchemas?.length === 0) {
        return false;
    }
    const schemaUids = schemasToUids(expectedSchemas, client.chain.id);
    const attestations = await getAttestation(address, { schemas: expectedSchemas });
    const schemasFound = attestations.map(
        (attestation) => attestation.schemaId,
    );

    return schemaUids.every((desiredSchemaUid) => schemasFound.includes(desiredSchemaUid));
}
