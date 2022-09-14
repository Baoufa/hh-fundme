const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


describe("FundMe", function () {
    let ContractFactory, contract;

    beforeEach(async function () {
        ContractFactory = await ethers.getContractFactory("FundMe");
        contract = await ContractFactory.deploy();
        await contract.deployed();
    });

    it("Should strat with a favorite number of 0", async function () {
        const currentValue = await contract.retrieve();
        const expectedValue = "0";
        expect(currentValue.toString()).to.equal(expectedValue);
        //assert.equal(currentValue.toString(), expectedValue);
    });
    
    it("Should update when call store", async function () {
        const expectedValue = "7";
        const txResponse = await contract.store(7);
        await txResponse.wait(1);
        const currentValue = await contract.retrieve();
        expect(currentValue.toString()).to.equal(expectedValue);
    });

    it("Should update when call addPerson", async function () {
        const expectedValue = ["John", "18"];
        const txResponse = await contract.addPerson(...expectedValue);
        await txResponse.wait(1);

        const currentValue = await contract.people(0);
        for(let i = 0; i < currentValue.length; i++){
          expect(currentValue[i].toString()).to.equal(expectedValue[i]);
        }

        const currentFavNum = await contract.nameToFavoriteNumber(expectedValue[0]);
        expect(currentFavNum.toString()).to.equal(expectedValue[1])
    });
});
