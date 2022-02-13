import { useEffect, useState, setState } from 'react'
import { ethers } from 'ethers';

import './Home.css';

import contractJson from '../../contracts/Freight.json';
// const contractAddress = "0x4f354363Be8AB99A288E48B018c0dA741c8cb360";
const abi = contractJson.abi;
const bytecode = contractJson.bytecode;

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [values, setValues] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("make sure to have metamask installed");
      return;
    } else {
      console.log('wallet exists. we are ready to go');
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("found an authorized account: ", account);
      setCurrentAccount(account);

    } else {
      console.log("no authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('found an account! addres: ', accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler}>
        Connect wallet
      </button>
    );
  }

  const interactContractHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const freightContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('initialize payment');
        let oneEther = ethers.utils.parseEther("1");
        let tax = ethers.utils.parseEther("0.1");

        let setValues1 = await freightContract.setValues(oneEther, tax, tax);

        console.log('mining contract');

        await setValues1.wait();
        console.log('mined');

      } else {
        console.log("ethereum object does not exist");
      }

    } catch (error) {
      console.log(error);
    }
  }

  const getValues = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const freightContract = new ethers.Contract(contractAddress, abi, signer);

      const values = await freightContract.getValues();
      setValues(values);

      // const test = ethers.utils.formatEther(values[0]);
      // console.log(test);
    }
  }

  const interactContract = () => {
    return (
      <button onClick={interactContractHandler}>interact contract</button>
    );
  }

  const createContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // create instance of contract factory
        let factory = new ethers.ContractFactory(abi, bytecode, signer);

        // deploy the contract
        let contract = await factory.deploy();

        // get its address
        console.log(`the contract address is `, contract.address);
        setContractAddress(contract.address);

        // wait until it's mined
        await contract.deployed();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const numbersList = () => {
    const values1 = [...values];

      const listItems = values1.map((el) =>
        <li key={el.toString()}>
          {ethers.utils.formatEther(el.toString())}
        </li>
      );

      return (
        <ul>
          {listItems}
        </ul>
      );
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div>
      <div>
        <button onClick={createContract}>Create contract</button>

        {currentAccount ? interactContract() : connectWalletButton()}
        <button onClick={getValues}>Get values from contract</button>

        <br />

        {currentAccount &&
          <p>Conectado em {currentAccount}</p>
        }

        {values && numbersList()}
      </div>
    </div>
  );
}

export default Home;
