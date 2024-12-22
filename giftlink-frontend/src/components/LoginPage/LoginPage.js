import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useNavigate, NavLink } from 'react-router-dom'; // Added NavLink and useNavigate
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsLoggedIn, setUserName } = useAppContext();
    const navigate = useNavigate(); // For navigation after successful login

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        if (authToken) {
            navigate('/gifts'); // Redirect to home if already logged in
        }
    }, [navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // Send the form data
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse error response from server
                setErrorMessage(errorData.message || 'Login failed. Please check your credentials.');
                return;
            }

            const data = await response.json();
            console.log('User logged in successfully:', data);

            // Store auth token, first name and redirecting
            sessionStorage.setItem('auth-token', data.authToken);
            sessionStorage.setItem('firstName', data.firstName);

            // Update global state
            setIsLoggedIn(true);
            setUserName(data.firstName);
            // Navigate to the gifts page after login
            navigate('/gifts');
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const handleEnterKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        onKeyDown={handleEnterKeyDown}
                        required
                    />
                </div>
                <button type="button" className="btn-login" onClick={handleLogin}>
                    Login
                </button>
            </form>
            <p className="text-center mt-3">
                Don't have an account?{' '}
                <NavLink to="/register" className="register-link">
                    Register Here
                </NavLink>
            </p>
        </div>
    );
}

export default LoginPage;