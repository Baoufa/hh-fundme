const { expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe;
          let deployerAddress;
          let mockV3Aggregator;
          const sendValue = ethers.utils.parseEther("1");

          beforeEach(async () => {
              const { deployer } = await getNamedAccounts();
              deployerAddress = deployer;
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });

          describe("constructor", () => {
              it("sets the aggregator address correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  expect(response).to.equal(mockV3Aggregator.address);
              });
          });

          describe("fund", () => {
              it("fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough, minimum 50 USD"
                  );
              });
              it("updated the amout funded data structure", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(
                      deployerAddress
                  );
                  expect(response.toString()).to.equal(sendValue.toString());
              });
              it("adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunders(0);
                  expect(funder).to.equal(deployerAddress);
              });
          });
          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });

              it("withdraw ETH from a single funder", async () => {
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);

                  expect(endingFundMeBalance).to.equal(0);
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString());
              });

              it("withdraw ETH from multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);

                  expect(endingFundMeBalance).to.equal(0);
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString());

                  await expect(fundMe.getFunders(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      expect(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          )
                      ).to.equal(0);
                  }
              });

              it("cheaper withdraw ETH from multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = fundMe.connect(
                          accounts[i]
                      );
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);

                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployerAddress);

                  expect(endingFundMeBalance).to.equal(0);
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString());

                  await expect(fundMe.getFunders(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      expect(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          )
                      ).to.equal(0);
                  }
              });

              it("only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];

                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
              });
          });
      });
