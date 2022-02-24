import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { appendFreight, setAddress } from "../store/modules/freights";
import { ethers } from "ethers";

import {
  addressFactory,
  FreightSituation,
  convertUnixDate,
} from "../utils/utils";

import contractFactory from "../contracts/FreightFactory.json";
import contractFreight from "../contracts/Freight.json";

const abiFreight = contractFreight.abi;
const abiFactory = contractFactory.abi;

function Freights() {
  // page states
  const [loaded, setLoaded] = useState(false);

  // redux states
  const addressFreights = useSelector((state) => state.freights.address);
  const freightsAll = useSelector((state) => state.freights.freights);
  const dispatch = useDispatch();

  const getAddress = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const freightFactory = new ethers.Contract(
        addressFactory,
        abiFactory,
        signer
      );

      const freights = await freightFactory.getFreights();
      dispatch(setAddress(freights));

      getFreights();
    }
  };

  const getFreights = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      for (var i = 0; i < addressFreights.length; i++) {
        const addressNow = addressFreights[i];

        // search each freight in the blockchain
        const freightNow = new ethers.Contract(addressNow, abiFreight, signer);

        const freightDetails = await freightNow.getFreight();
        dispatch(
          appendFreight(parseFreightDetails(addressNow, freightDetails))
        );
      }

      setLoaded(true);
    }
  };

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
      estipulated_value: ethers.utils.formatEther(
        freight_details[4].toString()
      ),
      fine_delivery_late: ethers.utils.formatEther(
        freight_details[5].toString()
      ),
      guarantee_value: ethers.utils.formatEther(freight_details[6].toString()),
    };

    return details;
  };

  const getFreightsResults = () => {
    const listItems = freightsAll.map((el) => (
      <tr key={el.address}>
        <td>{FreightSituation[el.situation]}</td>
        <td>{`${el.origin.country} - ${el.origin.state} - ${el.origin.city}`}</td>
        <td>{`${el.destination.country} - ${el.destination.state} - ${el.destination.city}`}</td>
        <td>{convertUnixDate(el.date_limit_load)}</td>
        <td>{convertUnixDate(el.date_limit_delivery)}</td>
        <td>{el.estipulated_value}</td>
        <td>{el.fine_delivery_late}</td>
        <td>{el.guarantee_value}</td>
        <td>
          {el.situation === 0 ? (
            <Link to={`${el.address}/bid`}>Place bid</Link>
          ) : (
            ""
          )}
        </td>
      </tr>
    ));

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
        <tbody>{listItems}</tbody>
      </table>
    );
  };

  useEffect(() => {
    if (!loaded) {
      if (addressFreights.length === 0) getAddress();
      else {
        if (freightsAll.length === 0) getFreights();
        else setLoaded(true);
      }
    }
  });

  return (
    <div>
      <h1>Freights</h1>

      {loaded && getFreightsResults()}
    </div>
  );
}

export default Freights;
