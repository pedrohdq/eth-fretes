const FreightFactory = artifacts.require("FreightFactory");
const path = require('path');
const fs = require('fs');

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(FreightFactory);
    const freightContract = await FreightFactory.deployed();

    const path_file = path.join(__dirname, "..", "src", "utils", "address.js");
    const content = `const address = "${freightContract.address}";\nexport default address;`;

    fs.writeFile(path_file, content, err => {
        if (err) {
            console.log(err);
            return;
        }
    })
}