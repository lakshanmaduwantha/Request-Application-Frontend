import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            console.log('Login successful:', response.data);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Pass token to parent component
            onLogin(response.data.token);

            // Optionally, redirect to dashboard or show success message
        } catch (error) {
            console.error('Login error:', error.response.data);
            // Handle login error
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
