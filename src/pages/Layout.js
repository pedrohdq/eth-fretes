import { Outlet, Link } from "react-router-dom";
import ConnectWallet from '../components/ConnectWallet';

function Layout() {
    return (
        <div className="container">
            <ul className="nav">
                <li><Link to="/" className="button">Home</Link></li>
                <li><Link to="/about" className="button">About</Link></li>
                <ConnectWallet />
            </ul>

            <Outlet />
        </div>
    );
}

export default Layout;