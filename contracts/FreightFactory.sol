// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "./CloneFactory.sol";
import "./Freight.sol";

// Smart contract FreightFactory
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

    /* ------------------------- CREATE FREIGHT ------------------------- */

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

    /* ------------------------- OFFERS ------------------------- */

    function createOffer(uint value_, uint advance_money_, address contract_) public {
        Freight freight = freights_contract[contract_];
        freight.createOffer(value_, advance_money_, msg.sender);

        // put into mapping by who made offers
        freights_offer[msg.sender].push(freight);
    }


    /* ------------------------- GETTERS ------------------------- */

    function getFreights() view public returns (Freight[] memory) {
        return (freights);
    }

    function getFreight(address address_freight_) view public returns (Freight) {
        return (freights_contract[address_freight_]);
    }

    function getFreightsByOwner(address owner_) view public returns (Freight[] memory) {
        return (freights_owner[owner_]);
    }

    function getFreightsByOffer(address offer_) view public returns (Freight[] memory) {
        return (freights_offer[offer_]);
    }

    function getLastFreightOwner(address owner_) view public returns (Freight) {
        return (freights_owner[owner_][freights_owner[owner_].length - 1]);
    }
}