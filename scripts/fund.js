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
    console.log("Funding Contract...");

    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("1"),
    });
    await transactionResponse.wait(1);

    console.log("Funded");
}

main().then(() =>
    process.exit(0).catch((err) => {
        console.error(err);
        process.exit(1);
    })
);
