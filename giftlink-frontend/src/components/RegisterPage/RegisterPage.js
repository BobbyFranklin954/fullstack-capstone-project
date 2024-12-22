import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const { setIsLoggedIn, setUserName } = useAppContext();

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Registration failed. Please try again.');
                return;
            }

            const data = await response.json();
            console.log('User registered successfully:', data);

            // Save the authentication token in sessionStorage
            sessionStorage.setItem('auth-token', data.authToken);
            sessionStorage.setItem('firstName', data.firstName);

            // Update global login status
            setIsLoggedIn(true);
            setUserName(data.firstName);

            // Redirect to gifts page
            navigate('/gifts');
        } catch (error) {
            console.error('Error registering:', error);
            // Check if it's a network error or something else
            const errorMsg = error.message.includes('NetworkError')
                ? 'Network error. Please check your connection.'
                : 'An unexpected error occurred. Please try again.';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {/* Error Message */}
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                    />
                </div>
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
                        placeholder="Create a password"
                        required
                    />
                </div>
                <button type="button" className="btn-register" onClick={handleRegister}>
                    Register
                </button>
            </form>
            <p className="text-center mt-3">
                Already have an account?{' '}
                <a href="/login" className="login-link">
                    Login Here
                </a>
            </p>
        </div>
    );
}

export default RegisterPage;