// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrderBook {
    address immutable _owner;

    event OrderExecuted(address token1Address, uint256 indexed token1Amount, address token2Address, uint256 indexed token2Amount);
    event RemainingOrder(address remainderAddress, uint256 indexed buyOrderAmount, uint256 indexed sellOrderAmount);

    struct Order {
        address executor;
        // buy address
        address buyTokenAddress;
        // sell address
        address sellTokenAddress;
        // buy amount
        uint256 buyTokenAmount;
        // sell amount
        uint256 sellTokenAmount;
        uint256 deadline;

    }

    constructor(address owner_){
        _owner = owner_;
        //        transferOwnership(owner_);
    }

    function executeOrder(Order calldata buyOrder, Order calldata sellOrder) external {
        require(buyOrder.deadline >= block.timestamp, "Buy Order Expired");
        require(sellOrder.deadline >= block.timestamp, "Sell Order Expired");
        require(msg.sender == _owner, "Unauthorized Action");
        require(buyOrder.buyTokenAddress == sellOrder.sellTokenAddress, "Invalid Pair");
        require(buyOrder.sellTokenAddress == sellOrder.buyTokenAddress, "Invalid Pair");
        require(buyOrder.buyTokenAmount / sellOrder.sellTokenAmount == buyOrder.sellTokenAmount / sellOrder.buyTokenAmount, "Orders are not matching 1");
        require(sellOrder.buyTokenAmount / buyOrder.sellTokenAmount == sellOrder.sellTokenAmount / buyOrder.buyTokenAmount, "Orders are not matching 2");
        require(buyOrder.buyTokenAmount / buyOrder.sellTokenAmount == sellOrder.sellTokenAmount / sellOrder.buyTokenAmount, "Orders are not matching 3");
        require(buyOrder.sellTokenAmount / buyOrder.buyTokenAmount == sellOrder.buyTokenAmount / sellOrder.sellTokenAmount, "Orders are not matching 4");

        if (buyOrder.buyTokenAmount >= sellOrder.sellTokenAmount) {
            // buy order buy token ( = sell order sell token) transfer
            ERC20(buyOrder.buyTokenAddress).transferFrom(sellOrder.executor, buyOrder.executor, sellOrder.sellTokenAmount);
            // buy order sell token ( = sell order buy token) transfer
            ERC20(sellOrder.buyTokenAddress).transferFrom(buyOrder.executor, sellOrder.executor, sellOrder.buyTokenAmount);
            emit OrderExecuted(buyOrder.buyTokenAddress, sellOrder.sellTokenAmount, buyOrder.sellTokenAddress, sellOrder.buyTokenAmount);
            emit RemainingOrder(buyOrder.executor, buyOrder.buyTokenAmount - sellOrder.sellTokenAmount, buyOrder.sellTokenAmount - sellOrder.buyTokenAmount);
        } else {
            // buy order buy token ( = sell order sell token) transfer
            ERC20(buyOrder.buyTokenAddress).transferFrom(sellOrder.executor, buyOrder.executor, buyOrder.buyTokenAmount);
            // buy order sell token ( = sell order buy token) transfer
            ERC20(sellOrder.buyTokenAddress).transferFrom(buyOrder.executor, sellOrder.executor, buyOrder.sellTokenAmount);

            emit OrderExecuted(buyOrder.buyTokenAddress, buyOrder.buyTokenAmount, buyOrder.sellTokenAddress, buyOrder.sellTokenAmount);
            emit RemainingOrder(sellOrder.executor, sellOrder.sellTokenAmount - buyOrder.buyTokenAmount, sellOrder.buyTokenAmount - buyOrder.sellTokenAmount);

        }


    }


}
