// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrderBook is Ownable {

    event OrderExecuted(address buyOrderAddress, uint256 buyOrderAmount, address sellOrderAddress, uint256 sellOrderAmount);
    event RemainingOrder(address buyOrderAddress, uint256 buyOrderAmount, address sellOrderAddress, uint256 sellOrderAmount);

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

    constructor(address owner){
        transferOwnership(owner);
    }

    //

    function executeOrder(Order calldata buyOrder, Order calldata sellOrder) public onlyOwner {
        require(buyOrder.buyTokenAddress == sellOrder.sellTokenAddress, "Invalid Pair");
        require(buyOrder.sellTokenAddress == sellOrder.buyTokenAddress, "Invalid Pair");
        require(buyOrder.buyTokenAmount/sellOrder.sellTokenAmount == buyOrder.sellTokenAmount/sellOrder.buyTokenAmount, "Orders are not matching");
        require(sellOrder.buyTokenAmount/buyOrder.sellTokenAmount == sellOrder.sellTokenAmount/buyOrder.buyTokenAmount, "Orders are not matching");
        require(buyOrder.buyTokenAmount/buyOrder.sellTokenAmount == sellOrder.sellTokenAmount/sellOrder.buyTokenAmount, "Orders are not matching");
        require(buyOrder.sellTokenAmount/buyOrder.buyTokenAmount == sellOrder.buyTokenAmount/buyOrder.sellTokenAmount, "Orders are not matching");

        if (buyOrder.buyTokenAmount >= sellOrder.sellTokenAmount) {
            // buy order buy token ( = sell order sell token) transfer
            ERC20(buyOrder.buyTokenAddress).transferFrom( sellOrder.executor, buyOrder.executor, sellOrder.sellTokenAmount);
            // buy order sell token ( = sell order buy token) transfer
            ERC20(sellOrder.buyTokenAddress).transferFrom(buyOrder.executor, sellOrder.executor, sellOrder.buyTokenAmount);
        } else {
            // buy order buy token ( = sell order sell token) transfer
            ERC20(buyOrder.buyTokenAddress).transferFrom( sellOrder.executor, buyOrder.executor, buyOrder.buyTokenAmount);
            // buy order sell token ( = sell order buy token) transfer
            ERC20(sellOrder.buyTokenAddress).transferFrom(buyOrder.executor, sellOrder.executor, buyOrder.sellTokenAmount);
        }


    }


}
