import type { Address } from "viem";
import { gql, request } from "graphql-request";
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { Attestation, AttestationSchema } from "./types";

// TODO: should resolve based on chain id?
export const indexApi = "https://base.easscan.org/graphql";

const schemaUids: Record<number, Record<AttestationSchema, string>> = {
    [base.id]: {
        "VERIFIED COUNTRY":"0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065",
        "VERIFIED ACCOUNT": "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
    },
};

export const attesterAddresses: Record<number, string[]> = {
    [base.id]: ["0x357458739F90461b99789350868CD7CF330Dd7EE"],
};

// TODO: use client from network but allow passing a custom client
export const client = createPublicClient({
    chain: base,
    transport: http(),
});

export function schemasToUids(schemas: AttestationSchema[], clientChainId?: number): string[] {
    // TODO: better error handling
    if (!clientChainId) {
        return [];
    }
    return schemas.map((schema) => schemaUids[clientChainId][schema]);
}