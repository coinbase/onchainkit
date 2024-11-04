declare const _default: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract ENS";
        readonly name: "ens_";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "registrarController_";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "reverseRegistrar_";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner_";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CantSetSelfAsDelegate";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CantSetSelfAsOperator";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NewOwnerIsZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoHandoverRequest";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "contentType";
        readonly type: "uint256";
    }];
    readonly name: "ABIChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "a";
        readonly type: "address";
    }];
    readonly name: "AddrChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "coinType";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "newAddress";
        readonly type: "bytes";
    }];
    readonly name: "AddressChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "ApprovalForAll";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "delegate";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "Approved";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "hash";
        readonly type: "bytes";
    }];
    readonly name: "ContenthashChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "uint16";
        readonly name: "resource";
        readonly type: "uint16";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "record";
        readonly type: "bytes";
    }];
    readonly name: "DNSRecordChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "uint16";
        readonly name: "resource";
        readonly type: "uint16";
    }];
    readonly name: "DNSRecordDeleted";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "lastzonehash";
        readonly type: "bytes";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes";
        readonly name: "zonehash";
        readonly type: "bytes";
    }];
    readonly name: "DNSZonehashChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes4";
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "implementer";
        readonly type: "address";
    }];
    readonly name: "InterfaceChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "NameChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipHandoverCanceled";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipHandoverRequested";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipTransferred";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "x";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "y";
        readonly type: "bytes32";
    }];
    readonly name: "PubkeyChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newRegistrarController";
        readonly type: "address";
    }];
    readonly name: "RegistrarControllerUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newReverseRegistrar";
        readonly type: "address";
    }];
    readonly name: "ReverseRegistrarUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "string";
        readonly name: "indexedKey";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "key";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "value";
        readonly type: "string";
    }];
    readonly name: "TextChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "newVersion";
        readonly type: "uint64";
    }];
    readonly name: "VersionChanged";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "contentTypes";
        readonly type: "uint256";
    }];
    readonly name: "ABI";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "addr";
    readonly outputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "coinType";
        readonly type: "uint256";
    }];
    readonly name: "addr";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "delegate";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "approve";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "cancelOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "clearRecords";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "completeOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "contenthash";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "name";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint16";
        readonly name: "resource";
        readonly type: "uint16";
    }];
    readonly name: "dnsRecord";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "ens";
    readonly outputs: readonly [{
        readonly internalType: "contract ENS";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "name";
        readonly type: "bytes32";
    }];
    readonly name: "hasDNSRecords";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes4";
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }];
    readonly name: "interfaceImplementer";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "delegate";
        readonly type: "address";
    }];
    readonly name: "isApprovedFor";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }];
    readonly name: "isApprovedForAll";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes[]";
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly name: "multicall";
    readonly outputs: readonly [{
        readonly internalType: "bytes[]";
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "nodehash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly name: "multicallWithNodeCheck";
    readonly outputs: readonly [{
        readonly internalType: "bytes[]";
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "result";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "ownershipHandoverExpiresAt";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "result";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "pubkey";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "x";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "y";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "recordVersions";
    readonly outputs: readonly [{
        readonly internalType: "uint64";
        readonly name: "";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "registrarController";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "renounceOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "requestOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "resolve";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "reverseRegistrar";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "contentType";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "setABI";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "coinType";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "a";
        readonly type: "bytes";
    }];
    readonly name: "setAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "a";
        readonly type: "address";
    }];
    readonly name: "setAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "setApprovalForAll";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "hash";
        readonly type: "bytes";
    }];
    readonly name: "setContenthash";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "setDNSRecords";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes4";
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }, {
        readonly internalType: "address";
        readonly name: "implementer";
        readonly type: "address";
    }];
    readonly name: "setInterface";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "string";
        readonly name: "newName";
        readonly type: "string";
    }];
    readonly name: "setName";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "x";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "y";
        readonly type: "bytes32";
    }];
    readonly name: "setPubkey";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "registrarController_";
        readonly type: "address";
    }];
    readonly name: "setRegistrarController";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "reverseRegistrar_";
        readonly type: "address";
    }];
    readonly name: "setReverseRegistrar";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "string";
        readonly name: "key";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "value";
        readonly type: "string";
    }];
    readonly name: "setText";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "hash";
        readonly type: "bytes";
    }];
    readonly name: "setZonehash";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }, {
        readonly internalType: "string";
        readonly name: "key";
        readonly type: "string";
    }];
    readonly name: "text";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "node";
        readonly type: "bytes32";
    }];
    readonly name: "zonehash";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export default _default;
//# sourceMappingURL=L2ResolverAbi.d.ts.map