// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

/* ------------------------- STRUCTS AND ENUMS ------------------------- */

enum FreightSituation {
    Auction,
    WaitingConfirmationTransporter,
    WaitingPickUpLoad,
    OnCarriage,
    Stopped,
    Delivered,
    DeliveredLate,
    NotDelivered,
    Returned
}

struct Address {
    string country;
    string state;
    string city;
    string street;
    string district; // neighborhood
    string zipcode;
    string number;
}

struct Offer {
    address payable address_offer;
    uint value;
    uint advance_money;
}

struct FreightDetails {
    Address origin;
    Address destination;

    uint256 date_limit_get_load;
    uint256 date_limit_delivery;

    uint estipulated_value;
    uint fine_delivery_late;
    uint guarantee_value; // guarantee value from the transporter, so it does not steal the load or something like that
}

struct WholeFreight {
    FreightDetails freight_details;
    Offer[] offers;
    FreightSituation situation;
}

contract Freight {
    /* ------------------------- INITIALIZERS ------------------------- */

    // global variables
    address payable owner;
    FreightDetails freight_details;
    Offer winning_offer;
    Offer[] offers;
    FreightSituation freight_situation;

    // flags
    bool is_advance_taken;
    bool is_whole_money_taken;
    bool is_delivery_late_taken;

    // constants
    string constant ONLY_OWNER = "Only the owner of the contract can perform this action";
    string constant ONLY_WINNER_OFFER = "Only the winner offer transporter can perform this action";
    string constant OWNER_CANT = "The owner of the contract can't perform this action";
    string constant FREIGHT_SITUATION_DIFFERENT = "The freight situation is different of what was supposed to be";
    string constant VALUES_DIFFER = "The values are different";
    string constant WHOLE_MONEY_TAKEN = "The account had already withdrawn the whole money!";

    // events
    event Log(address indexed sender, string message);

    constructor() {
        freight_situation = FreightSituation.Auction;
        
        is_advance_taken = false;
        is_whole_money_taken = false;
        is_delivery_late_taken = false;
    }

    // modifier for owner-only
    modifier onlyowner(address sender) {
        require (sender == owner, ONLY_OWNER);
        _;
    }

    // modifier for winning-only
    modifier onlywinner(address sender) {
        require (sender == winning_offer.address_offer, ONLY_WINNER_OFFER);
        _;
    }

    function setOwner(address owner_) public {
        require(owner == address(0));
        owner = payable(owner_);
    }

    /* ------------------------- ONLY OWNER FUNCTIONS ------------------------- */

    function setOrigin(
        string memory country_, string memory state_, string memory city_,
        string memory street_, string memory district_, string memory zipcode_,
        string memory number_, address sender
    ) public onlyowner(sender) {
        freight_details.origin.country = country_;
        freight_details.origin.state = state_;
        freight_details.origin.city = city_;

        freight_details.origin.street = street_;
        freight_details.origin.district = district_;
        freight_details.origin.zipcode = zipcode_;

        freight_details.origin.number = number_;
    }

    function setDestination(
        string memory country_, string memory state_, string memory city_,
        string memory street_, string memory district_, string memory zipcode_,
        string memory number_, address sender
    ) public onlyowner(sender) {
        freight_details.destination.country = country_;
        freight_details.destination.state = state_;
        freight_details.destination.city = city_;

        freight_details.destination.street = street_;
        freight_details.destination.district = district_;
        freight_details.destination.zipcode = zipcode_;

        freight_details.destination.number = number_;
    }

    function setDates(
        uint256 date_limit_get_load_, uint256 date_limit_delivery_, address sender
    ) public onlyowner(sender) {
        freight_details.date_limit_get_load = date_limit_get_load_;
        freight_details.date_limit_delivery = date_limit_delivery_;
    }

    function setValues(
        uint estipulated_value_, uint fine_delivery_late_, uint guarantee_value_, address sender
    ) public onlyowner(sender) {
        freight_details.estipulated_value = estipulated_value_;
        freight_details.fine_delivery_late = fine_delivery_late_;
        freight_details.guarantee_value = guarantee_value_;
    }

    function setWinningOffer(uint i, address sender) public onlyowner(sender) {
        require(freight_situation == FreightSituation.Auction, FREIGHT_SITUATION_DIFFERENT);
        
        // selecting the winner offer
        winning_offer = offers[i];

        // change the status of the freight
        freight_situation = FreightSituation.WaitingConfirmationTransporter;

        emit Log(owner, "The owner had set a winning offer");
    }

    /* ------------------------- OFFERS ------------------------- */

    function createOffer(
        uint value_, uint advance_money_, address sender
    ) public {
        require(freight_situation == FreightSituation.Auction, FREIGHT_SITUATION_DIFFERENT); // the situation must be as Auction
        require(sender != owner, OWNER_CANT); // owner can't put a offer

        offers.push(Offer({
            address_offer: payable(sender),
            value: value_,
            advance_money: advance_money_
        }));
    }

    /* ------------------------- INTERACTIONS ON THE CARRIAGE ------------------------- */

    // winning offer transporter must accept the offer
    function acceptOffer(address sender) public payable onlywinner(sender) {
        require(msg.value == freight_details.guarantee_value, VALUES_DIFFER); // check if its the exact amount
        require(freight_situation == FreightSituation.WaitingConfirmationTransporter, FREIGHT_SITUATION_DIFFERENT);

        freight_situation = FreightSituation.WaitingPickUpLoad;

        emit Log(msg.sender, "Winner offer had accepted and put the guarantee value at the contract");
    }

    // the owner confirms the transporter have arrived to pick up the load
    function pickUpLoad(address sender) public onlyowner(sender) payable {
        require(freight_situation == FreightSituation.WaitingPickUpLoad, FREIGHT_SITUATION_DIFFERENT);
        require(msg.value == winning_offer.value, VALUES_DIFFER); // owner must put its money into the contract

        freight_situation = FreightSituation.OnCarriage;

        emit Log(msg.sender, "Owner confirmed: transporter picked up the load! Total money had been aported to the contract");
    }

    // the transporter can withdraw the advance money, put it into the contract by the owner
    function withdrawAdvanceMoney(address sender) public onlywinner(sender) {
        require(!is_advance_taken, "The account had already withdrawn the advance money");

        // send advance money from the contract to the transporter account
        winning_offer.address_offer.transfer(winning_offer.advance_money);

        // set flag that the advance money had already been taken
        is_advance_taken = true;

        emit Log(msg.sender, "The transporter had withdrawn the advance money");
    }

    /* ------------------------- ACTIONS THE TRANSPORTER CAN PERFORM (ON THE CARRIAGE) ------------------------- */

    // set situation to stopped
    function stopCarriage(address sender) public onlywinner(sender) {
        require(freight_situation >= FreightSituation.OnCarriage &&
                freight_situation < FreightSituation.Delivered, FREIGHT_SITUATION_DIFFERENT);

        freight_situation = FreightSituation.Stopped;

        emit Log(msg.sender, "The transporter had stopped the carriage");
    }

    // set situation to on carriage
    function onCarriage(address sender) public onlywinner(sender) {
        require(freight_situation >= FreightSituation.OnCarriage &&
                freight_situation < FreightSituation.Delivered, FREIGHT_SITUATION_DIFFERENT);
        
        freight_situation = FreightSituation.OnCarriage;

        emit Log(msg.sender, "The transporter is on the carriage again");
    }

    // the transporter had delivered the load into the destination
    function deliver(address sender) public onlywinner(sender) {
        require(freight_situation == FreightSituation.OnCarriage);

        if (block.timestamp <= freight_details.date_limit_delivery) {
            freight_situation = FreightSituation.Delivered;
            emit Log(msg.sender, "The transporter had delivered the load in time");

        } else {
            freight_situation = FreightSituation.DeliveredLate;
            emit Log(msg.sender, "The transporter had delivered the load, late");
        }
    }

    // the transporter, after delivering the load, can withdraw the whole money of the contract
    function withdrawWholeMoney(address sender) public onlywinner(sender) {
        require(freight_situation == FreightSituation.Delivered ||
                freight_situation == FreightSituation.DeliveredLate, FREIGHT_SITUATION_DIFFERENT);
        require(!is_whole_money_taken, WHOLE_MONEY_TAKEN);

        // transfer the whole amount of money (including the guarantee fee)
        if (freight_situation == FreightSituation.Delivered) {
            winning_offer.address_offer.transfer(address(this).balance);
        } else {
            winning_offer.address_offer.transfer(address(this).balance - freight_details.fine_delivery_late);
        }

        // set the flag
        is_whole_money_taken = true;
    }

    // the owner can say the load wasn't delivered (only after the time is higher than the delivery time)
    // than, change the situation and gets back the whole amount of money of the contract
    function cancelFreight(address sender) public onlyowner(sender) {
        require(freight_situation == FreightSituation.OnCarriage ||
                freight_situation == FreightSituation.Stopped, FREIGHT_SITUATION_DIFFERENT);
        require(block.timestamp > freight_details.date_limit_delivery);
        require(!is_whole_money_taken, WHOLE_MONEY_TAKEN);

        // change the situation
        freight_situation = FreightSituation.NotDelivered;

        // transfer the whole money to the owner of the contract
        owner.transfer(address(this).balance);

        // set the flag
        is_whole_money_taken = true;
    }

    // if the transporter had delivered the load in late time, the owner can get its fine of delivery late
    function getDeliveryLateFine(address sender) public onlyowner(sender) {
        require(freight_situation == FreightSituation.DeliveredLate, FREIGHT_SITUATION_DIFFERENT);
        require(!is_delivery_late_taken, "The delivery late fine had alrady been taken");

        // transfer the fine to the owner
        owner.transfer(freight_details.fine_delivery_late);

        // set the flag
        is_delivery_late_taken = true;
    }

    /* ------------------------- GETTERS ------------------------- */

    function getOrigin() public view returns (
        string memory, string memory, string memory,
        string memory, string memory, string memory,
        string memory
    ) {
        return (
            freight_details.origin.country,
            freight_details.origin.state,
            freight_details.origin.city,

            freight_details.origin.street,
            freight_details.origin.district,
            freight_details.origin.zipcode,

            freight_details.origin.number
        );
    }

    function getDestination() public view returns (
        string memory, string memory, string memory,
        string memory, string memory, string memory,
        string memory
    ) {
        return (
            freight_details.destination.country,
            freight_details.destination.state,
            freight_details.destination.city,

            freight_details.destination.street,
            freight_details.destination.district,
            freight_details.destination.zipcode,

            freight_details.destination.number
        );
    }

    function getFreightSituation() public view returns (FreightSituation) {
        return (freight_situation);
    }

    function getOffers() public view returns (Offer[] memory) {
        return (offers);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getValues() public view returns (uint, uint, uint) {
        return (freight_details.estipulated_value, freight_details.fine_delivery_late, freight_details.guarantee_value);
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }
}