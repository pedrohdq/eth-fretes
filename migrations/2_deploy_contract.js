const Freight = artifacts.require("Freight");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Freight);
}