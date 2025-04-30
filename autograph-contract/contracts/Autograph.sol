// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Autograph {
    event Signature(
        address signer,
        string message,
        string location,
        uint256 timestamp
    );

    function sign(string memory message, string memory location) public {
        emit Signature(msg.sender, message, location, block.timestamp);
    }
}
