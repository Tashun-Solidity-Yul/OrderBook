// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./AttackFuzzyIdentity.sol";

contract DeployerContract {
    event DeployingAddress(address);

    function getAddress(uint256 _salt) public view returns (address) {
        bytes memory bytecode = type(AttackFuzzyIdentity).creationCode;
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), address(this), _salt, keccak256(bytecode)
            )
        );
        return address (uint160(uint(hash)));
    }

    function deploy(uint _salt) public payable {
        bytes memory bytecode = type(AttackFuzzyIdentity).creationCode;
        address addr;
        assembly {
            addr := create2(
            callvalue(), // wei sent with current call
            // Actual code starts after skipping the first 32 bytes
            add(bytecode, 0x20),
            mload(bytecode), // Load the size of code contained in the first 32 bytes
            _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit DeployingAddress(addr);

    }
}
