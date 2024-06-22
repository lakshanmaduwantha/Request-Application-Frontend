import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                username,
                email,
                password
            });
            console.log('User registered:', response.data);
            navigate('/login'); // Redirect to login page upon successful registration
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const messages = Object.keys(errors).map(field => errors[field].join(', '));
                setErrorMessages(messages);
            } else {
                console.error('Error registering user:', error);
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Register</h2>
                {errorMessages.length > 0 && (
                    <div className="error-messages">
                        <ul>
                            {errorMessages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
