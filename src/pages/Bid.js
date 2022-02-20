import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { addressFactory, FreightSituation } from '../utils/utils';
import { ethers } from 'ethers';

import MakeBid from '../components/Bid/MakeBid';

import contractFactory from '../contracts/FreightFactory.json';
import contractFreight from '../contracts/Freight.json';

const abiFactory = contractFactory.abi;
const abiFreight = contractFreight.abi;

function Bid() {
    const { address } = useParams();
    const navigate = useNavigate();

    const freightsAll = useSelector((state) => state.freights.freights);
    const currentAccount = useSelector((state) => state.web3.currentAccount);

    const freight = freightsAll.find(el => el.address === address);
    const isOwner = freight.owner.toLowerCase() == currentAccount.toLowerCase() ? true : false;
    const [winningOffer, setWinningOffer] = useState(null);

    const [loaded, setLoaded] = useState(false);
    const [offers, setOffers] = useState([]);
    const [bid, setBid] = useState(null);

    const getBlockchainOffers = async() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const freightBlockchain = new ethers.Contract(address, abiFreight, signer);

            // get offers from the blockchain
            const offersBlockchain = await freightBlockchain.getOffers();
            setOffers(parseOffers(offersBlockchain));

            // get the winning offer
            const winningOffer1 = await freightBlockchain.getWinningOffer();
            setWinningOffer(parseOffer(winningOffer1));

            setLoaded(true);
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

    const acceptOffer = async (index) => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const freight_now = new ethers.Contract(freight.address, abiFreight, signer);

            await freight_now.setWinningOffer(index);

            // if all gone right, redirect to the home page with a success message
            navigate('/', { state: { success: "SetWinningOffer" } });
        }
    }

    const showOffers = () => {
        const showOffers1 = offers.map((el, index) => 
            <tr key={el.address}>
                <td>{ el.address }</td>
                <td>{ el.value }</td>
                <td>{ el.advance_money }</td>

                {
                    isOwner &&
                        <td>
                            { JSON.stringify(el) === JSON.stringify(winningOffer) ?
                                <span>Offer accepted</span> :
                                freight.situation === 0 ?
                                    <span className='link' onClick={() => acceptOffer(index)}>Accept offer</span> :
                                    <span>Offer expired</span>
                            }
                        </td>
                }
            </tr>
        );

        return (
            <table>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Value</th>
                        <th>Advance money</th>

                        { isOwner && <th>Actions</th> }
                    </tr>
                </thead>

                <tbody>
                    { showOffers1 }
                </tbody>
            </table>
        );
    }

    const handleBid = (bid) => {
        setBid(bid);
    }

    const submit = (e) => {
        e.preventDefault();
        interactContract();
    }

    const interactContract = async() => {
        const { ethereum } = window;

        // parse values to ethereum
        let value = ethers.utils.parseEther(bid.value);
        let advance_money = ethers.utils.parseEther(bid.advance_money);

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const freightFactory = new ethers.Contract(addressFactory, abiFactory, signer);

            // initialize create offer
            let createOffer = await freightFactory.createOffer(value, advance_money, address);
            await createOffer.wait();

            // if all gone, refresh page
            navigate(`/freights/${address}/bid`);
        }
    }

    useEffect(() => {
        if (!loaded)
            getBlockchainOffers();
    })

    return (
        <div>
            <h1>Bid</h1>
            <code>Contract address: { address }</code>
            <br />
            <code>Contract owner: { freight.owner } { isOwner && <b>(YOU)</b> }</code>

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
                    </tr>
                </thead>
                <tbody>
                    <tr key={freight.address}>
                        <td>{ FreightSituation[freight.situation] }</td>
                        <td>{ `${freight.origin.country} - ${freight.origin.state} - ${freight.origin.city}` }</td>
                        <td>{ `${freight.destination.country} - ${freight.destination.state} - ${freight.destination.city}` }</td>
                        <td>{ freight.date_limit_load }</td>
                        <td>{ freight.date_limit_delivery }</td>
                        <td>{ freight.estipulated_value }</td>
                        <td>{ freight.fine_delivery_late }</td>
                        <td>{ freight.guarantee_value }</td>
                    </tr>
                </tbody>
            </table>

            <h3>Offers</h3>

            {offers.length !== 0 ?
                 showOffers() :
                <div>There are no offers</div>
            }

            {
                !isOwner &&
                    <div className='marginTop'>
                        <h3>Make a bid</h3>
                        
                        <form>
                            <MakeBid onChange={handleBid} />
                            
                            <span
                                className="button primary"
                                onClick={submit}
                            >
                                Submit bid
                            </span>
                        </form>
                    </div>
            }
        </div>
    );
}

export default Bid;