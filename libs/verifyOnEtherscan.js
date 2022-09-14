const { run } = require("hardhat");

async function verifyOnEtherScan(contractAddress, args) {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log(`✅ - ${err.message}`);
        } else {
            console.log(`❌ - Error message: ${err}`);
        }
    }
}

module.exports = verifyOnEtherScan;