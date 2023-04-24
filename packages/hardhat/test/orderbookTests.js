const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("", () => {
  let deployer, user1, user2, user3;
  let token1, token2;
  describe("", () => {
    before("", async () => {
      [deployer, user1, user2, user3] = await ethers.getSigner();
      const contractFactory = await ethers.getContractFactory("ERC20Token");
      token1 = await contractFactory.connect(deployer).deploy(deployer);
      token2 = await contractFactory.connect(deployer).deploy(deployer);
    });

    it("", () => {

    });

  });

});