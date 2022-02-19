import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import Place from '../components/AddFreight/Place';
import Dates from '../components/AddFreight/Dates';
import Values from '../components/AddFreight/Values';

import { addressFactory } from '../utils/utils';
import contractFactory from '../contracts/FreightFactory.json';
import contractFreight from '../contracts/Freight.json';

const abiFactory = contractFactory.abi;
const abiFreight = contractFreight.abi;

function AddFreight() {
    let navigate = useNavigate();
    const currentAccount = useSelector((state) => state.web3.currentAccount);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [dates, setDates] = useState(null);
    const [values, setValues] = useState(null);

    const handleOrigin = (value) => {
        setOrigin(value);
    }

    const handleDestination = (value) => {
        setDestination(value);
    }

    const handleDates = (value) => {
        setDates(value);
    }

    const handleValues = (value) => {
        setValues(value);
    }

    const submit = (e) => {
        e.preventDefault();
        interactContract();
    }

    const interactContract = async () => {
        try {
            const { ethereum } = window;

            // parse values (to ETH)
            let estipulated_value = ethers.utils.parseEther(values.estipulated_value);
            let fine_delivery_late = ethers.utils.parseEther(values.fine_delivery_late);
            let guarantee_value = ethers.utils.parseEther(values.guarantee_value);

            // parse datetimes (UNIX timestamps)
            let date_limit_get_load = Math.floor(new Date(dates.date_limit_get_load).getTime() / 1000);
            let date_limit_delivery = Math.floor(new Date(dates.date_limit_delivery).getTime() / 1000);

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const freightFactory = new ethers.Contract(addressFactory, abiFactory, signer);

                // initialize create freight
                let address_new_freight = await freightFactory.createFreight();
                await address_new_freight.wait();

                // get last freight of this msg.sender
                let last_freight = await freightFactory.getLastFreightOwner(currentAccount);

                // put the values into the fields of the freight
                const freight = new ethers.Contract(last_freight, abiFreight, signer);

                // set origin
                let setOrigin = await freight.setOrigin(
                    origin.country, origin.state, origin.city,
                    origin.street, origin.district, origin.zipcode,
                    origin.number
                );
                await setOrigin.wait();

                // set destination
                let setDestination = await freight.setDestination(
                    destination.country, destination.state, destination.city,
                    destination.street, destination.district, destination.zipcode,
                    destination.number
                );
                await setDestination.wait();

                // set dates
                let setDates = await freight.setDates(
                    date_limit_get_load, date_limit_delivery
                );
                await setDates.wait();

                // set values
                let setValues = await freight.setValues(
                    estipulated_value, fine_delivery_late, guarantee_value
                );
                await setValues.wait();

                // if all gone right, go to the Home page with an alert of success
                navigate('/', { state: { success: "FreightAdded" } })

            } else alert("ethereum object does not exist");

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // if it is not connected to the wallet, return to Home page
        if (currentAccount === "")
            navigate('/', { state: { error: 'NotConnected' } });
    });

    return (
        <div>
            <h1>Add freight</h1>
            <small>In order to make a new freight, you need to provide the next details: </small>

            <form onSubmit={submit}>
                <Place title="Origin" onChange={handleOrigin} />
                <Place title="Destination" onChange={handleDestination} />
                <Dates title="Dates" onChange={handleDates} />
                <Values title="Values" onChange={handleValues} />

                <div className='flex flexRight' style={{ marginRight: '50px' }}>
                    <span
                        className='button primary'
                        style={{ marginTop: '20px' }}
                        onClick={submit}
                    >
                        Submit informations
                    </span>
                </div>
            </form>
        </div>
    );
}

export default AddFreight;