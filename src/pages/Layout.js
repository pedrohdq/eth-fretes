import { Outlet, Link } from "react-router-dom";

function Layout() {
    return (
        <div className="container">
            <ul className="nav">
                <li><Link to="/" className="button">Home</Link></li>
                <li><Link to="/about" className="button">About</Link></li>
                <li className="button">Connect wallet</li>
            </ul>

            <Outlet />
        </div>
    );
}

export default Layout;