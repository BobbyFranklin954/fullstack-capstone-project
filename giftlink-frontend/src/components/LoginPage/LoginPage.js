import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useNavigate, NavLink } from 'react-router-dom'; // Added NavLink and useNavigate
import './LoginPage.css';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate(); // For navigation after successful login

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // Send the form data
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('User logged in successfully:', data);

            // Simulate storing auth token and redirecting
            sessionStorage.setItem('auth-token', data.token || 'mock-token');
            navigate('/'); // Redirect to the home page after login
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
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