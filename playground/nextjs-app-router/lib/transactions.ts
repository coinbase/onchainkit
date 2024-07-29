import { clickAbi } from "./abi/Click";
import { deployedContracts } from "./constants";

export const clickContracts = [
    {
        address: deployedContracts[85432].click,
        abi: clickAbi,
        functionName: 'click',
        args: [],
      }
]