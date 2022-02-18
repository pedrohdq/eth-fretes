const FreightFactory = artifacts.require("FreightFactory");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(FreightFactory);
}