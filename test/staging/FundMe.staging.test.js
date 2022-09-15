const { expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const decryptKey = require("../../libs/decryptKey");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me", () => {
          let fundMe;
          const sendValue = ethers.utils.parseEther("0.001"); // more than 1 dollar 

          beforeEach(async () => {
              const deployerWallet = await decryptKey();
              fundMe = await ethers.getContract("FundMe", deployerWallet);
          });

          it("allows people to fund and withdraw", async () => {
              const txResponse = await fundMe.fund({ value: sendValue });
              await txResponse.wait(1);
              const withdrawResponse = await fundMe.cheaperWithdraw();
              await withdrawResponse.wait(1);
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              expect(endingBalance.toString()).to.equal("0");
          });
      });
