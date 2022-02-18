import { Link } from "react-router-dom";

function Home() {
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