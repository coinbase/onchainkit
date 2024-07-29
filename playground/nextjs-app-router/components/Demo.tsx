"use client";

import { AppContext, AppProvider, OnchainKitComponent } from "@/components/AppProvider";
import { Chain } from "@/components/form/chain";
import { PaymasterUrl } from "@/components/form/paymaster";
import { WalletType } from "@/components/form/wallet-type";
import { ActiveComponent } from "./form/active-component";
import TransactionDemo from "./demo/Transaction";
import { useContext } from "react";
import SwapDemo from "./demo/Swap";

function Demo() {
    const {activeComponent} = useContext(AppContext)

    console.log('activeComponent', activeComponent)
    console.log('activeComponent is transaction', activeComponent === OnchainKitComponent.Transaction)

    return (
        <>
            <div className="hidden min-w-120 w-1/4 flex-col border-r bg-background p-6 sm:flex">
                <div className="mb-12 text-lg font-semibold">OnchainKit Demo</div>
                <form className="grid gap-8">
                    <ActiveComponent />
                    <WalletType />
                    <Chain />
                    <PaymasterUrl />
                </form>
                <a target="_blank" className="hover:underline text-sm absolute bottom-6 left-6" href="https://github.com/ilikesymmetry/onchainkit-demo">View Github</a>
            </div>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-col justify-center w-full h-full">
                    {activeComponent === OnchainKitComponent.Transaction ? (
                        <TransactionDemo />
                    ) : activeComponent === OnchainKitComponent.Swap ? (
                        <SwapDemo />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    )
}

export default Demo