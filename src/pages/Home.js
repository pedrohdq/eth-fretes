import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { Errors, Success } from '../utils/utils';

function Home() {
    const { state } = useLocation();

    useEffect(() => {
        // if there is any error passed as paremeter, show a alert saying it
        // same for success alert
        if (state && state.error)
            alert(Errors[state.error]);

        else if (state && state.success) {
            alert(Success[state.success]);
        }
    });

    return (
        <div>
            <h1>Descentralized Freights</h1>
            <img src={require("../assets/cover.png")} alt="" />

            <h2>What are you looking for?</h2>

            <div className="flex">
                <div className="box">
                    <h3>For freights to transport</h3>
                    <Link to="/freights" className="button blue">Go to freights page</Link>
                </div>

                <div className="box">
                    <h3>To add freight, so someone can transport</h3>
                    <Link to="/add-freight" className="button blue">Add freight</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;