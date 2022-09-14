////// WHEN NOT USE PACKAGE HARDHAT-DEPLOY ////


// const { ethers, run, network } = require("hardhat");
// const { decryptKey } = require("../libs/decryptKey");

// function loggerReceipt(_contractReceipt) {
//     console.log(``);
//     console.log(`🌈 - Contract Deployed!`);
//     console.log(`👤 - Deployer Address: ${_contractReceipt.from}`);
//     console.log(`📍 - Contract Address: ${_contractReceipt.contractAddress}`);

//     if (network.name !== "hardhat") {
//         console.log(`🤑 - Gaz used: ${_contractReceipt.gasUsed.toString()}`);
//     }
//     console.log(``);
// }

// async function verifyOnEtherScan(contractAddress, args) {
//     try {
//         await run("verify:verify", {
//             address: contractAddress,
//             constructorArguments: args,
//         });
//     } catch (err) {
//         if (err.message.toLowerCase().includes("already verified")) {
//             console.log(`✅ - ${err.message}`);
//         } else {
//             console.log(`❌ - Error message: ${err}`);
//         }
//     }
// }

// async function main() {
//     const ContractFactory = await ethers.getContractFactory("FundMe");

//     let wallet;
//     if (network.name !== "goerli") {
//         [wallet] = await ethers.getSigners();
//     }

//     ///////// USING ENCRYPTED KEYS //////////
//     if (network.name === "goerli") {
//         wallet = await decryptKey();
//     }
//     /////////////// END /////////////////////

//     console.log(``);
//     console.log(`⌛ - Deploying, please wait...`);
//     console.log(``);

//     const contract = await ContractFactory.connect(wallet).deploy();

//     if (network.name === "goerli") {
//         console.log(
//             `🌐 - View TX on etherscan: https://goerli.etherscan.io/tx/${contract.deployTransaction.hash}`
//         );
//     }

//     await contract.deployed();
//     const txReceipt = await contract.deployTransaction.wait();
//     loggerReceipt(txReceipt);

//     if (network.name === "goerli" && process.env.ETHERSCAN_API_KEY) {
//         console.log(`⌛ - Verifying on Etherscan, please wait...`);
//         console.log(``);
//         await contract.deployTransaction.wait(6);
//         await verifyOnEtherScan(txReceipt.contractAddress, []);
//     }
// }

// main().then(() => {
//     process.exit(0).catch((error) => {
//         console.log(error);
//         process.exit(1);
//     });
// });
