const {network, ethers} = require("hardhat");
const {expect} = require("chai");


describe("", () => {
  let deployer, user1, user2, user3;
  let token1, token2, orderBook;
  describe("", () => {
    before("", async () => {
      [deployer, user1, user2, user3] = await ethers.getSigners();
      const contractFactory = await ethers.getContractFactory("ERC20Token");
      const orderBookContractFactory = await ethers.getContractFactory("OrderBook");
      token1 = await contractFactory.connect(deployer).deploy("Token1", "TK1");
      token1.transfer(user1.address, 500000);
      token1.transfer(user2.address, 500000);
      token2 = await contractFactory.connect(deployer).deploy("Token2", "TK2");
      token2.transfer(user1.address, 500000);
      token2.transfer(user2.address, 500000);
      orderBook = await orderBookContractFactory.connect(deployer).deploy(deployer.address);
    });

    it("Equal Token Amounts Exchaning", async () => {

      const sellOrderToken1Amount = 100;
      const sellOrderToken2Amount = 50;
      const buyOrderToken1Amount = 100;
      const buyOrderToken2Amount = 50;

      let height = (await ethers.provider.getBlock("latest")).timestamp
      let nonce = parseInt(await token1.nonces(user1.address), 10)


      let amount01U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));
      // height = (await ethers.provider.getBlock("latest")).timestamp
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user1.address), 10)
      const amount02U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token1.nonces(user2.address), 10)
      let amount01U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user2.address), 10)
      const amount02U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      const permitTnxAmount01U01 = await token1.permit(user1.address, orderBook.address, 100, height + 60 * 60, amount01U01.v, amount01U01.r, amount01U01.s)
      const permitTnxAmount01U02 = await token1.permit(user2.address, orderBook.address, 100, height + 60 * 60, amount01U02.v, amount01U02.r, amount01U02.s)
      const permitTnxAmount02U01 = await token2.permit(user1.address, orderBook.address, 50, height + 60 * 60, amount02U01.v, amount02U01.r, amount02U01.s)
      const permitTnxAmount02U02 = await token2.permit(user2.address, orderBook.address, 50, height + 60 * 60, amount02U02.v, amount02U02.r, amount02U02.s)


      const sellOrder = {
        executor: user1.address,
        buyTokenAddress: token1.address,
        sellTokenAddress: token2.address,
        buyTokenAmount: sellOrderToken1Amount,
        sellTokenAmount: sellOrderToken2Amount,
        deadline: height + 60 * 60,

      }
      const buyOrder = {
        executor: user2.address,
        buyTokenAddress: token2.address,
        sellTokenAddress: token1.address,
        buyTokenAmount: buyOrderToken2Amount,
        sellTokenAmount: buyOrderToken1Amount,
        deadline: height + 60 * 60,

      }
      const tnx1 = await orderBook.connect(deployer).executeOrder(buyOrder, sellOrder);
      const receipt = await tnx1.wait();
      expect(receipt.events.filter(a => a.event == "RemainingOrder")[0].args[0]).to.be.equal(user2.address)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args[1], 10)).to.be.equal(0)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args[2], 10)).to.be.equal(0)
    });



    it("Exceessive Token 1 amount", async () => {

      const sellOrderToken1Amount = 150;
      const sellOrderToken2Amount = 50;
      const buyOrderToken1Amount = 75;
      const buyOrderToken2Amount = 25;

      let height = (await ethers.provider.getBlock("latest")).timestamp
      let nonce = parseInt(await token1.nonces(user1.address), 10)


      let amount01U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));
      // height = (await ethers.provider.getBlock("latest")).timestamp
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user1.address), 10)
      const amount02U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token1.nonces(user2.address), 10)
      let amount01U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user2.address), 10)
      const amount02U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      const permitTnxAmount01U01 = await token1.permit(user1.address, orderBook.address, 100, height + 60 * 60, amount01U01.v, amount01U01.r, amount01U01.s)
      const permitTnxAmount01U02 = await token1.permit(user2.address, orderBook.address, 100, height + 60 * 60, amount01U02.v, amount01U02.r, amount01U02.s)
      const permitTnxAmount02U01 = await token2.permit(user1.address, orderBook.address, 50, height + 60 * 60, amount02U01.v, amount02U01.r, amount02U01.s)
      const permitTnxAmount02U02 = await token2.permit(user2.address, orderBook.address, 50, height + 60 * 60, amount02U02.v, amount02U02.r, amount02U02.s)


      const sellOrder = {
        executor: user1.address,
        buyTokenAddress: token1.address,
        sellTokenAddress: token2.address,
        buyTokenAmount: sellOrderToken1Amount,
        sellTokenAmount: sellOrderToken2Amount,
        deadline: height + 60 * 60,

      }
      const buyOrder = {
        executor: user2.address,
        buyTokenAddress: token2.address,
        sellTokenAddress: token1.address,
        buyTokenAmount: buyOrderToken2Amount,
        sellTokenAmount: buyOrderToken1Amount,
        deadline: height + 60 * 60,

      }
      const tnx1 = await orderBook.connect(deployer).executeOrder(buyOrder, sellOrder);
      const receipt = await tnx1.wait();
      expect(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token1Address).to.be.equal(token2.address)
      expect(parseInt(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token1Amount, 10)).to.be.equal(25)
      expect(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token2Address).to.be.equal(token1.address)
      expect(parseInt(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token2Amount, 10)).to.be.equal(75)

      expect(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.remainderAddress).to.be.equal(user1.address)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.buyOrderAmount, 10)).to.be.equal(25)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.sellOrderAmount, 10)).to.be.equal(75)
    });

    it("Exceessive Token 1 amount reversed", async () => {

      const sellOrderToken1Amount = 75;
      const sellOrderToken2Amount = 25;
      const buyOrderToken1Amount = 150;
      const buyOrderToken2Amount = 50;

      let height = (await ethers.provider.getBlock("latest")).timestamp
      let nonce = parseInt(await token1.nonces(user1.address), 10)


      let amount01U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user1.address), 10)
      const amount02U01 = ethers.utils.splitSignature(await user1.provider.send("eth_signTypedData_v4",
        [user1.address, JSON.stringify(msgParams(user1.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));
      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token1.nonces(user2.address), 10)
      let amount01U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 100, nonce, height + 60 * 60, token1.address, "Token1"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      nonce = parseInt(await token2.nonces(user2.address), 10)
      const amount02U02 = ethers.utils.splitSignature(await user2.provider.send("eth_signTypedData_v4",
        [user2.address, JSON.stringify(msgParams(user2.address, orderBook.address, 50, nonce, height + 60 * 60, token2.address, "Token2"))]
      ));

      // ---------------------------------------------------------------------------------------------------------
      const permitTnxAmount01U01 = await token1.permit(user1.address, orderBook.address, 100, height + 60 * 60, amount01U01.v, amount01U01.r, amount01U01.s)
      const permitTnxAmount01U02 = await token1.permit(user2.address, orderBook.address, 100, height + 60 * 60, amount01U02.v, amount01U02.r, amount01U02.s)
      const permitTnxAmount02U01 = await token2.permit(user1.address, orderBook.address, 50, height + 60 * 60, amount02U01.v, amount02U01.r, amount02U01.s)
      const permitTnxAmount02U02 = await token2.permit(user2.address, orderBook.address, 50, height + 60 * 60, amount02U02.v, amount02U02.r, amount02U02.s)


      const sellOrder = {
        executor: user1.address,
        buyTokenAddress: token1.address,
        sellTokenAddress: token2.address,
        buyTokenAmount: sellOrderToken1Amount,
        sellTokenAmount: sellOrderToken2Amount,
        deadline: height + 60 * 60,

      }
      const buyOrder = {
        executor: user2.address,
        buyTokenAddress: token2.address,
        sellTokenAddress: token1.address,
        buyTokenAmount: buyOrderToken2Amount,
        sellTokenAmount: buyOrderToken1Amount,
        deadline: height + 60 * 60,

      }
      const tnx1 = await orderBook.connect(deployer).executeOrder(buyOrder, sellOrder);
      const receipt = await tnx1.wait();
      console.log(receipt.events.filter(a => a.event == "RemainingOrder")[0]. args)

      expect(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token1Address).to.be.equal(token2.address)
      expect(parseInt(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token1Amount, 10)).to.be.equal(25)
      expect(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token2Address).to.be.equal(token1.address)
      expect(parseInt(receipt.events.filter(a => a.event == "OrderExecuted")[0].args.token2Amount, 10)).to.be.equal(75)

      expect(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.remainderAddress).to.be.equal(user2.address)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.buyOrderAmount, 10)).to.be.equal(25)
      expect(parseInt(receipt.events.filter(a => a.event == "RemainingOrder")[0].args.sellOrderAmount, 10)).to.be.equal(75)
    });

  });

});

const msgParams = (owner, spender, value, nonce, deadline, contractAddress, domainName) => {

  const typedData = {
    types: {
      EIP712Domain: [
        {name: "name", type: "string"},
        {name: "version", type: "string"},
        {name: "chainId", type: "uint256"},
        {name: "verifyingContract", type: "address"},
      ],
      Permit: [
        {name: "owner", type: "address"},
        {name: "spender", type: "address"},
        {name: "value", type: "uint256"},
        {name: "nonce", type: "uint256"},
        {name: "deadline", type: "uint256"}
      ],
    },
    primaryType: "Permit",
    domain: {
      name: domainName,
      version: "1",
      chainId: 31337,
      verifyingContract: contractAddress
    },
    message: {
      owner: owner,
      spender: spender,
      value: value,
      nonce: nonce,
      deadline: deadline
    }
  };
  return typedData;
}