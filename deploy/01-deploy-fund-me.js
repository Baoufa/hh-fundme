const { network } = require('hardhat');
const { networkConfig, developmentChains } = require('../helper-hardhat-config');
const decryptKey = require('../libs/decryptKey');
const verifyOnEtherScan = require ('../libs/verifyOnEtherscan');

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const isDevelopmentChain = developmentChains.includes(network.name);

    // Depending on blockchain parametrize call on other contracts
    let ethUsdPriceFeedAddress;
    let sender; 

    if(isDevelopmentChain){
      //when going for localhost or hardhat network we want to use a mock
      sender = deployer;
      const ethUsdPriceAggregator = await deployments.get("MockV3Aggregator");
      ethUsdPriceFeedAddress = ethUsdPriceAggregator.address;
    } else {
      const wallet = await decryptKey();
      sender = wallet.privateKey;
      ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
      from : sender,
      args : args, // put priceFeed Address,
      log :true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });

    if(!isDevelopmentChain && process.env.ETHERSCAN_API_KEY){
      await verifyOnEtherScan(fundMe.address, args)
    }
    log("-----------------------------------")
};

module.exports.tags = ["all", "fundme"];

