import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import './styles.css'; // Import your styles

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
    const [showRegister, setShowRegister] = useState(false); // Manage registration form state

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.post('http://localhost:8000/api/verifyToken', { token });
                    if (response.data.valid) {
                        setIsLoggedIn(true);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    handleLogout();
                }
            } else {
                handleLogout();
            }
        };

        verifyToken(); // Call verifyToken inside useEffect
    }, []); // Empty dependency array to run this effect only once on mount

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const handleRegister = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setShowRegister(false); // Hide registration form after successful registration
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            <header>
                <h1>Request Management System</h1>
                {!isLoggedIn ? (
                    <>
                        {showRegister ? (
                            <Register onRegister={handleRegister} />
                        ) : (
                            <LoginForm onLogin={handleLogin} />
                        )}
                        <button onClick={() => setShowRegister(!showRegister)}>
                            {showRegister ? 'Go to Login' : 'Register'}
                        </button>
                    </>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </header>
            {isLoggedIn && <Dashboard />}
        </div>
    );
};

export default App;
