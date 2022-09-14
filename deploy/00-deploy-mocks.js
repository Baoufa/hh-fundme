const { network } = require('hardhat');
const { developmentChains } = require('../helper-hardhat-config');

const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
  
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    //when going for localhost or hardhat network we want to use a mock
    if(developmentChains.includes(network.name)) {
      log("Local network detected! Deploying Mocks...");
      await deploy("MockV3Aggregator", {
        contract: "MockV3Aggregator",
        from: deployer,
        log: true,
        args: [DECIMALS, INITIAL_ANSWER]
      })
      log("Mocks deployed");
      log("---------------------------------------------")
    }
};

module.exports.tags = ["all", "mocks"];