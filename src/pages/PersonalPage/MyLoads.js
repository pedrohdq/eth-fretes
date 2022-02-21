import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

// import icons
import { Icon } from '@mdi/react';
import { mdiCashMultiple } from '@mdi/js';
import { mdiCarPickup } from '@mdi/js';

import { addressFactory, FreightSituation, convertUnixDate } from '../../utils/utils';
import contractFactory from '../../contracts/FreightFactory.json';
import contractFreight from '../../contracts/Freight.json';

const abiFactory = contractFactory.abi;
const abiFreight = contractFreight.abi;

function MyLoads() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [freights, setFreights] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const getAddress = async() => {
        const { ethereum } = window;

        if (ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const freightFactory = new ethers.Contract(addressFactory, abiFactory, signer);
                const addressOwner = signer.getAddress();

                // get addresses of freights by owner
                const addresses1 = await freightFactory.getFreightsByOwner(addressOwner);
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
        
                for (var i = 0; i < addresses.length; i++) {
                    const addressNow = addresses[i];
        
                    // search each freight in the blockchain
                    const freightNow = new ethers.Contract(addressNow, abiFreight, signer);
        
                    // get freightDetails
                    let freightDetails = await freightNow.getFreight();
                    freightDetails = parseFreightDetails(addressNow, freightDetails);

                    // get winning offer
                    let winningOffer = await freightNow.getWinningOffer();
                    winningOffer = parseOffer(winningOffer);

                    const dict = {
                        details: freightDetails,
                        winning_offer: winningOffer
                    };

                    // appending to the array
                    setFreights(oldArray => [...oldArray, dict])
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

    const parseFreightDetails = (address, freight) => {
        const situation = freight[0];
        const freight_details = freight[1];
        const owner = freight[2];
    
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
            guarantee_value: ethers.utils.formatEther(freight_details[6].toString())
        };
    
        return details;
    }

    const getFreightsResults = () => {
        // action buttons
        const pickUpLoad = async(freight) => {
            const { ethereum } = window;

            try {
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const freight1 = new ethers.Contract(freight.details.address, abiFreight, signer);

                    // the value of advance money must be the advance money of the offer
                    const options = { value: ethers.utils.parseEther(freight.winning_offer.value) };

                    // pick up the load
                    await freight1.pickUpLoad(options);

                    // if all gone right, go to the main page with a success message
                    navigate('/', { state: { success: "PickedUpLoad" } });
                }
            } catch (error) {
                console.log(error);
            }
        }

        const getActionButtons = (freight) => {
            switch (freight.details.situation) {
                case 2:
                    return (
                        <div className="tooltip" onClick={() => pickUpLoad(freight)}>
                            <Icon path={mdiCarPickup} size="30" />
                            <span className="hint">Transporter picked up load (need {freight.winning_offer.advance_money}ETH)</span>
                        </div>
                    );
                default:
                    return;
            }
        }

        const listItems = freights.map((el) => 
            <tr key={el.details.address}>
                <td>{ FreightSituation[el.details.situation] }</td>
                <td>{ `${el.details.origin.country} - ${el.details.origin.state} - ${el.details.origin.city}` }</td>
                <td>{ `${el.details.destination.country} - ${el.details.destination.state} - ${el.details.destination.city}` }</td>
                <td>{ convertUnixDate(el.details.date_limit_load) }</td>
                <td>{ convertUnixDate(el.details.date_limit_delivery) }</td>
                <td>{ el.details.estipulated_value }</td>
                <td>{ el.details.fine_delivery_late }</td>
                <td>{ el.details.guarantee_value }</td>
                <td>
                    <Link to={`/freights/${el.details.address}/bid`} className="tooltip">
                        <Icon path={mdiCashMultiple} size="30" color="black" />
                        <span className="hint">See bids</span>
                    </Link>
                    { getActionButtons(el) }
                </td>
            </tr>
        )
        
        return (
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Date to get load</th>
                        <th>Date delivery</th>
                        <th>Estipulated value</th>
                        <th>Fine delivery late</th>
                        <th>Guarantee value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { listItems }
                </tbody>
            </table>
        );
    }

    useEffect(() => {
        if(!loaded)
            getAddress();
    });

    return (
        <div>
            <h1>My loads</h1>

            {
                loaded &&
                    getFreightsResults()
            }
        </div>
    );
}

export default MyLoads;