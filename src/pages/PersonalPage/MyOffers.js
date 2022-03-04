import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';

import { FreightSituation, convertUnixDate } from '../../utils/utils';
import addressFactory from "../../utils/address";
import contractFactory from '../../contracts/FreightFactory.json';
import contractFreight from '../../contracts/Freight.json';

const abiFactory = contractFactory.abi;
const abiFreight = contractFreight.abi;

function MyOffers() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [freights, setFreights] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const currentAccount = useSelector((state) => state.web3.currentAccount);

    const getAddress = async() => {
        const { ethereum } = window;

        if (ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const freightFactory = new ethers.Contract(addressFactory, abiFactory, signer);
                const addressOwner = signer.getAddress();

                // get addresses of freights by offer
                const addresses1 = await freightFactory.getFreightsByOffer(addressOwner);
                setAddresses(addresses1);

                getFreights();
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getFreights = async() => {
        const { ethereum } = window;
    
        if (ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
        
                // for each address, get its informations
                for (var i = 0; i < addresses.length; i++) {
                    let dict_freight = {};

                    const addressNow = addresses[i];
        
                    // search each freight in the blockchain
                    const freightNow = new ethers.Contract(addressNow, abiFreight, signer);
        
                    // get general informations
                    const freightDetails = await freightNow.getFreight();
                    dict_freight.details = parseFreightDetails(addressNow, freightDetails);

                    // get offers
                    const offers_ = await freightNow.getOffers();
                    dict_freight.offers = parseOffers(offers_);

                    // get winning offer (if situation > 0)
                    if (dict_freight.details.situation === 0)
                        dict_freight.winning_offer = null;
                    else {
                        const winning_offer_ = await freightNow.getWinningOffer();
                        dict_freight.winning_offer = parseOffer(winning_offer_);
                    }

                    // push to the array the dict informations
                    setFreights(oldArray => [...oldArray, dict_freight]);
                }

                setLoaded(true);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const parseOffer = (offer_) => {
        if (offer_ == null)
            return null;
        else {
            return {
                address: offer_[0],
                value: ethers.utils.formatEther(offer_[1].toString()),
                advance_money: ethers.utils.formatEther(offer_[2].toString())
            };
        }
    }

    const parseOffers = (offersBlockchain) => {
        let offersParsed = []

        for (var i = 0; i < offersBlockchain.length; i++) {
            const offer_now = offersBlockchain[i];

            offersParsed.push(parseOffer(offer_now));
        }
        
        return offersParsed;
    }

    const parseFreightDetails = (address, freight) => {
        const situation = freight[0];
        const freight_details = freight[1];
        const owner = freight[2];
        const flags = freight[3];
    
        const details = {
            owner: owner,
            address: address,
            situation: situation,
            origin: freight_details[0],
            destination: freight_details[1],
            date_limit_load: freight_details[2].toString(),
            date_limit_delivery: freight_details[3].toString(),
            estipulated_value: ethers.utils.formatEther(freight_details[4].toString()),
            fine_delivery_late: ethers.utils.formatEther(freight_details[5].toString()),
            guarantee_value: ethers.utils.formatEther(freight_details[6].toString()),
            flags: flags
        };
    
        return details;
    }

    const getFreightResults = () => {
        const getResultOffer = (freight) => {
            if (freight.winning_offer) {
                if (freight.winning_offer.address.toLowerCase() === currentAccount.toLowerCase()) {
                    if (freight.details.situation >= 1 && freight.details.situation <= 4)
                        return `Won - On going`;
                    else
                        return `Won - Delivered`;
                } else
                    return `Lost`;
            } else
                return `Still in auction`;
        }

        const getSituationOffer = (freight, offer) => {
            if (freight.winning_offer) {
                if (JSON.stringify(freight.winning_offer) === JSON.stringify(offer))
                    return `WON`;
                else
                    return `LOST`;
            } else
                return `In auction`;
        }

        const showMyOffers = (freight) => {
            const myOffers = freight.offers.filter(el => el.address.toLowerCase() === currentAccount.toLowerCase());

            return myOffers.map((offer, index) =>
                <tr key={index.toString()}>
                    <td>{ offer.value }</td>
                    <td>{ offer.advance_money }</td>
                    <td>{ getSituationOffer(freight, offer) }</td>
                </tr>
            )
        }

        // action buttons
        const acceptOffer = async(freight) => {
            const { ethereum } = window;

            try {
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const freight1 = new ethers.Contract(freight.details.address, abiFreight, signer);

                    // the value of the acceptOffer must be the guarantee_value of the freight
                    const options = { value: ethers.utils.parseEther(freight.details.guarantee_value) };

                    // accept offer
                    await freight1.acceptOffer(options);

                    // // if all gone right, go to the main page with a success message
                    navigate('/', { state: { success: "OfferAccepted" } });
                }
            } catch (error) {
                console.log(error);
            }
        }

        const stopLoad = async() => {}
        const onCarriage = async() => {}
        const deliverLoad = async() => {}

        const getActionButtons = (freight) => {
            if (freight.winning_offer && freight.winning_offer.address.toLowerCase() === currentAccount.toLowerCase()) {
                // it is the winner, make a swich/case for the situation
                switch (freight.details.situation) {
                    case 1:
                        return (
                            <div>
                                <span className='button orange' onClick={() => acceptOffer(freight)}>
                                    Accept offer
                                </span>
                                <br /><br />
                                <small>You need to have { freight.details.guarantee_value }ETH</small>
                            </div>
                        );
                    
                    case 2:
                        return (
                            <span>Waiting the load owner to say you picked up the load</span>
                        );

                    case 3:
                        return (
                            <div className="flex">
                                <span className='button orange' style={{ marginRight: '10px' }} onClick={stopLoad}>
                                    Stop
                                </span>
                                <span className='button orange' onClick={deliverLoad}>
                                    Deliver
                                </span>
                            </div>
                        );
                    
                    case 4:
                        return (
                            <span className='button orange' onClick={onCarriage}>
                                On carriage
                            </span>
                        ); 
                    default:
                        return (
                            <span>The load is not with you anymore</span>
                        );
                }
            } else {
                return (
                    <Link to={`/freights/${freight.details.address}/bid`}>See bids</Link>
                );
            }
        }

        const listItems = freights.map((el, index) => 
            <div
                key={index.toString()}
                className="box"
            >
                <h3>{ getResultOffer(el) }</h3>
                <p>{ el.details.address }</p>
                <p>Situation: { FreightSituation[el.details.situation] }</p>
                <p>Origin: { `${el.details.origin.country} - ${el.details.origin.state} - ${el.details.origin.city}` }</p>
                <p>Destination: { `${el.details.destination.country} - ${el.details.destination.state} - ${el.details.destination.city}` }</p>
                
                <p>{ convertUnixDate(el.details.date_limit_load) } - { convertUnixDate(el.details.date_limit_delivery) }</p>

                Your offers
                
                <table style={{ marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th>Value</th>
                            <th>Advance money</th>
                            <th>Situation</th>
                        </tr>
                    </thead>
                    <tbody>
                        { showMyOffers(el) }
                    </tbody>
                </table>

                { getActionButtons(el) }
            </div>
        );

        return (
            <div className='flex'>
                { listItems }
            </div>
        );
    }

    useEffect(() => {
        if(!loaded)
            getAddress();
    })

    return (
        <div>
            <h1>My offers</h1>

            {
                loaded &&
                    getFreightResults()
            }
        </div>
    );
}

export default MyOffers;