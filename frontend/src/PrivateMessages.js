// src/PrivateMessages.js

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function PrivateMessages() {
    const [conversations, setConversations] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const { onlineUsers } = useContext(UserContext); 

    useEffect(() => {
        if (!username) {
            navigate('/');
        }

        // Récupérer l'historique des conversations
        const fetchConversations = async () => {
            const response = await fetch(`http://localhost:5000/conversations?username=${username}`);
            const data = await response.json();
            setConversations(data);
        };

        fetchConversations();
    }, [username, navigate]);

    const sendPrivateMessage = async (e) => {
        e.preventDefault();
        if (messageText.trim() && selectedUser) {
            await fetch('http://localhost:5000/messages/private', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: username, receiver: selectedUser, text: messageText }),
            });
            setMessageText(''); // Réinitialiser le champ de message
        }
    };

    return (
        <div>
            <h2>Messages Privés</h2>
            <h3>Utilisateurs en ligne :</h3>
            <ul>
                {onlineUsers.map((user, index) => (
                    <li key={index} onClick={() => setSelectedUser(user)}>{user}</li>
                ))}
            </ul>

            {selectedUser && (
                <form onSubmit={sendPrivateMessage}>
                    <h4>Envoyer un message à {selectedUser}</h4>
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Écrivez votre message ici..."
                        required
                    />
                    <button type="submit">Envoyer</button>
                </form>
            )}

            {/* Ajoutez ici le reste de la fonctionnalité de messagerie privée */}
        </div>
    );
}

export default PrivateMessages;
