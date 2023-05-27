// const {ethers} = require("hardhat");
// const {expect} = require("chai");
// describe("", () => {
//   let fuzzyLogicContract, attackerFuzzyLogicContract, deployerContract;
//   let user1,user2;
//   before("", async () => {
//     [user1,user2] = await ethers.getSigners()
//     const contractFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
//     const attackerContractFactory = await ethers.getContractFactory("AttackFuzzyIdentity");
//     const deployerContractFactory = await ethers.getContractFactory("DeployerContract");
//
//     deployerContract = await deployerContractFactory.connect(user1).deploy()
//     fuzzyLogicContract = await contractFactory.deploy()
//     attackerFuzzyLogicContract = await attackerContractFactory.deploy()
//     console.log(deployerContract.address)
//
//   })
//   it.only("", async () => {
//     // for (let i = 0 ; i< 10000000000; i ++ ) {
//     //   const result = await deployerContract.getAddress(i);
//     //   console.log(i)
//     //   if (result.toLowerCase().includes("0badc0de") || result.toLowerCase().includes("badc0de0")) {
//     //     console.log(i)
//     //     break;
//     //   }
//     // }
//
//     while (true) {
//       const randomNum = ethers.BigNumber.from(ethers.utils.randomBytes(32))
//       const result = await deployerContract.getAddress(randomNum);
//       // console.log(randomNum._hex)
//       if (result.toLowerCase().includes("0badc0de") || result.toLowerCase().includes("badc0de0")) {
//         console.log(randomNum._hex)
//         break;
//       }
//     }
//     // "0badc0de"
//     // "badc0de0"
//
//     // const result = await attackerFuzzyLogicContract.attack(fuzzyLogicContract.address);
//     // const result = await fuzzyLogicContract.isBadCode(user1.address)
//     // console.log(result)
//
//   })
//   after("", async () => {
//     // expect(await fuzzyLogicContract.isComplete()).to.be.true;
//   })
// })