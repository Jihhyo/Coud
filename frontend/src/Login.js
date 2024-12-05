import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(                `${process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:4002'}/login`, {
                username,
                password
            });
            
            if (response.status === 200) {
                localStorage.setItem('username', username);
                navigate('/chat');
            }
        } catch (err) {
            setError(err.response?.data.message || "Erreur de connexion.");
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control mb-3"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control mb-3"
                />
                <button type="submit" className="btn btn-primary">Se connecter</button>
            </form>
            <p>Pas encore de compte ? <a href="/register">Créer un compte</a></p>
        </div>
    );
}

export default Login;
