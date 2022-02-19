import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAddress, appendFreight } from '../store/modules/freights';
import { ethers } from 'ethers';

import { addressFactory } from '../utils/utils';
import contractFactory from '../contracts/FreightFactory.json';
import contractFreight from '../contracts/Freight.json';

const abiFactory = contractFactory.abi;
const abiFreight = contractFreight.abi;

function Freights() {
    // page states
    const [loaded, setLoaded] = useState(false);

    // redux states
    const addressFreights = useSelector((state) => state.freights.address);
    const freightsAll = useSelector((state) => state.freights.freights);
    const dispatch = useDispatch();

    const getAddress = async() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const freightFactory = new ethers.Contract(addressFactory, abiFactory, signer);

            const freights = await freightFactory.getFreights();
            dispatch(setAddress(freights));

            getFreights();
            setLoaded(true);
        }
    }

    const getFreights = async() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            for (var i = 0; i < addressFreights.length; i++) {
                const addressNow = addressFreights[i];

                // search each freight in the blockchain
                const freightNow = new ethers.Contract(addressNow, abiFreight, signer);

                const freightDetails = await freightNow.getFreight();
                dispatch(appendFreight(parseFreightDetails(freightDetails)));
            }
        }
    }

    const parseFreightDetails = (freight) => {
        const situation = freight[0];
        const freight_details = freight[1];

        const details = {
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

    const getFreightResults = () => {
        const listItems = freightsAll.map((el) => 
            <div className="box">
                <p>Situation: { el.situation }</p>
                <p>Origin: { `${el.origin.country} - ${el.origin.state} - ${el.origin.city}` }</p>
            </div>
        )
        
        return (
            <div className="flex">
                { listItems }
            </div>
        );
    }
    
    useEffect(() => {
        if (!loaded)
            getAddress();
    });

    return (
        <div>
            <h1>Freights</h1>

            {
                loaded &&
                    getFreightResults()
            }
        </div>
    );
}

export default Freights;