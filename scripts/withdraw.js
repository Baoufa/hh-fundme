const { ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const decryptKey = require("../libs/decryptKey");

async function main() {
    let deployerAccount;

    if (developmentChains.includes(network.name)) {
        const { deployer } = await getNamedAccounts();
        deployerAccount = deployer;
    } else {
        deployerAccount = await decryptKey();
    }

    const fundMe = await ethers.getContract("FundMe", deployerAccount);
    console.log("Withdraw Contract...");

    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1)
    console.log(`Got it withdraw}`);
}

main().then(() =>
    process.exit(0).catch((err) => {
        console.error(err);
        process.exit(1);
    })
);
