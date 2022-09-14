const { task } = require("hardhat/config");

const accountsTask = task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
      console.log(account.address);
  }
});

module.exports = accountsTask;