import "bootstrap/js/src/collapse.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";

import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                        <NavLink to="/" className="nav-link">Exercises</NavLink>
                    </li>
                    <li className="navbar-item">
                        <NavLink to="/create" className="nav-link">Create Exercise Log</NavLink>
                    </li>
                    <li className="navbar-item">
                        <NavLink to="/user" className="nav-link">Create User</NavLink>
                    </li>
                 </ul>
        </nav>
        
    );
}