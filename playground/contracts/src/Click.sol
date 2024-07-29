// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Click {
    event Clicked(address indexed account);

    function click() public {
        emit Clicked(msg.sender);
    }
}
