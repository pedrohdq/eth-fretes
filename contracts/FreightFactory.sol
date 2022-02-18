// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "./CloneFactory.sol";
import "./Freight.sol";

contract FreightFactory is CloneFactory {
    // global variables
    Freight[] public freights; // all freights
    
    mapping(address => Freight) freights_contract; // mapping freights by its contracts
    mapping(address => Freight[]) freights_owner; // mapping freights by owner
    mapping(address => Freight[]) freights_offer; // mapping who made offer to freights

    address master_contract; // master contract to use as clone factory

    // constructor, initializing an empty contract (to use as CloneFactory)
    constructor() {
        Freight master = new Freight();
        master_contract = address(master);
    }

    /* ------------------------- CREATE FREIGHT + OFFER ------------------------- */

    function createFreight() public {
        // create new freight
        Freight freight = Freight(createClone(master_contract));
        freight.setOwner(msg.sender);

        // put into mapping by address
        freights_contract[address(freight)] = freight;

        // put into mapping by owner
        freights_owner[msg.sender].push(freight);

        // put into freights array
        freights.push(freight);
    }

    function createOffer(uint value_, uint advance_money_, address contract_) public {
        Freight freight = freights_contract[contract_];
        freight.createOffer(value_, advance_money_, msg.sender);

        // put into mapping by who made offers
        freights_offer[msg.sender].push(freight);
    }

    /* ------------------------- ONLY OWNER FUNCTIONS ------------------------- */

    function setOrigin(
        string memory country_, string memory state_, string memory city_,
        string memory street_, string memory district_, string memory zipcode_,
        string memory number_, address contract_
    ) public {
        Freight freight = freights_contract[contract_];
        freight.setOrigin(country_, state_, city_, street_, district_, zipcode_, number_, msg.sender);
    }

    function setDestination(
        string memory country_, string memory state_, string memory city_,
        string memory street_, string memory district_, string memory zipcode_,
        string memory number_, address contract_
    ) public {
        Freight freight = freights_contract[contract_];
        freight.setDestination(country_, state_, city_, street_, district_, zipcode_, number_, msg.sender);
    }

    function setDates(
        uint256 date_limit_get_load_, uint256 date_limit_delivery_, address contract_
    ) public {
        Freight freight = freights_contract[contract_];
        freight.setDates(date_limit_get_load_, date_limit_delivery_, msg.sender);
    }

    function setValues(
        uint estipulated_value_, uint fine_delivery_late_, uint guarantee_value_, address contract_
    ) public {
        Freight freight = freights_contract[contract_];
        freight.setValues(estipulated_value_, fine_delivery_late_, guarantee_value_, msg.sender);
    }

    /* ------------------------- GETTERS ------------------------- */

    function getFreights() view public returns (Freight[] memory) {
        return (freights);
    }

    function getFreightsByOwner(address owner_) view public returns (Freight[] memory) {
        return (freights_owner[owner_]);
    }

    function getFreightAddress(address address_freight) view public returns (Freight) {
        return (freights_contract[address_freight]);
    }
}