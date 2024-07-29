import { useContext } from "react";
import { AppContext } from "../AppProvider";
import { clickContracts } from "@/lib/transactions";
import { useCapabilities } from "@/lib/hooks";
import { 
    Transaction, 
    TransactionButton, 
    TransactionSponsor, 
    TransactionStatus, 
    TransactionStatusAction, 
    TransactionStatusLabel,
    TransactionToast,
    TransactionToastAction,
    TransactionToastIcon,
    TransactionToastLabel, 
  } from '@coinbase/onchainkit/transaction'; 
import { Address } from "viem";
import { useAccount } from "wagmi";

function Click() {
    const {chainId} = useContext(AppContext)
    const account = useAccount()
    const capabilities = useCapabilities()
    const contracts = clickContracts

    console.log('chainId', chainId)

    return (
        <Transaction 
            chainId={chainId ?? 84532} // something breaks if we don't have default network?
            address={account.address as Address} 
            contracts={contracts} 
            capabilities={capabilities} 
        >
            <TransactionButton text="Click" />
            <TransactionSponsor />
            <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
            </TransactionStatus>
            <TransactionToast>
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
            </TransactionToast>
        </Transaction> 
    )
}

function TransactionDemo() {
    return (
        <div className="grid gap-8 w-1/2 mx-auto">
            <Click />
        </div>
    )
}

export default TransactionDemo