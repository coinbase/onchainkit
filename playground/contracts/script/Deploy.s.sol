// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {Click} from "../src/Click.sol";

// forge script Deploy --account dev --rpc-url $BASE_SEPOLIA_RPC --verify --verifier-url $SEPOLIA_BASESCAN_API --etherscan-api-key $BASESCAN_API_KEY --broadcast -vvvv
contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        // deploy with salt to use deterministic-deployment-proxy for easy multi-chain deployments
        new Click{salt: 0}();

        vm.stopBroadcast();
    }
}
