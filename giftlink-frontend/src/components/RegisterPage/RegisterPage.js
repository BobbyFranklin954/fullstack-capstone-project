import React, { useState } from 'react';
import { urlConfig } from '../../config';
import './RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = async () => {
        try {
            // Simulate API interaction
            const response = await fetch(`${urlConfig.backendUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // Send the form data
            });

            if (!response.ok) {
                throw new Error(`Registration failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('User registered successfully:', data);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
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
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="button" className="btn-register" onClick={handleRegister}>
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;