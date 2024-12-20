import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink

export default function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(sessionStorage.getItem('auth-token'));

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">GiftLink</NavLink>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/gifts"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Gifts
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/search"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Search
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                    {isLoggedIn ? (
                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}