import React, { useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        if (authTokenFromSession) {
            setIsLoggedIn(true);
            setUserName(nameFromSession || 'User');
        } else {
            setIsLoggedIn(false);
            setUserName('');
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.clear(); // Clear all session storage items
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app');
    };

    const profileSection = () => {
        navigate('/app/profile');
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
                        <>
                            <li className="nav-item">
                                <span
                                    className="nav-link"
                                    style={{ color: 'black', cursor: 'pointer' }}
                                    onClick={profileSection}
                                >
                                    Welcome, {userName}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link active login-btn' : 'nav-link login-btn'
                                    }
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link active register-btn' : 'nav-link register-btn'
                                    }
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>

            </div>
        </nav>
    );
}