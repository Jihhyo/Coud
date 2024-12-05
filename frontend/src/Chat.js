import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io(process.env.REACT_APP_CHAT_SERVICE_URL || 'http://localhost:5000');
const GIPHY_API_KEY = 'Uvn90C70yGLrRgN93loo91SjBvrH0bvH'; // Remplacez par votre clé API Giphy

function Chat() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [privateMessage, setPrivateMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [status, setStatus] = useState('online');
    const [gifs, setGifs] = useState([]);
    const [gifSearch, setGifSearch] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Ref pour la boîte de chat uniquement
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    
        // Récupérer les messages existants depuis le serveur
        const fetchMessages = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_CHAT_SERVICE_URL || 'http://localhost:5000'}/messages`
                );                setChat(response.data.messages); // Mettez à jour l'état avec les messages récupérés
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        };
    
        fetchMessages(); // Appel à la fonction pour charger les messages
    
        // Informer le serveur que l'utilisateur se connecte
        socket.emit('setUsername', username);
    
        // Écouter les nouveaux messages du serveur
        socket.on('message', (msg) => {
            if (msg.username && msg.text) {
                setChat(prevChat => [...prevChat, msg]); // Ajouter le nouveau message à l'état du chat
            }
        });
    
        // Écouter les utilisateurs en ligne
        socket.on('usersOnline', (users) => {
            setOnlineUsers(users);
        });
    
// Écouter les anciens messages lorsque l'utilisateur se connecte
socket.on('loadMessages', (messages) => {
    setChat(messages);
});


        // Écouter les messages privés
        socket.on('privateMessage', (msg) => {
            alert(`Message privé de ${msg.sender}: ${msg.text}`);
        });
    
        return () => {
            socket.off('message');
            socket.off('usersOnline');
            socket.off('privateMessage');
            socket.off('loadMessages');
        };
    }, [username, navigate]);
    

    // Fonction pour scroller automatiquement vers le bas de la boîte de chat uniquement
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    // Scroll automatiquement après chaque mise à jour des messages
    useEffect(() => {
        scrollToBottom();  // Déclenche le scroll auto après chaque ajout de message
    }, [chat]);  // `chat` est mis à jour à chaque nouveau message

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msg = { username, text: message };
            socket.emit('message', msg);  // Envoie du message
            setMessage('');
        }
    };

    const sendPrivateMessage = (e) => {
        e.preventDefault();
        if (privateMessage.trim() && selectedUser) {
            socket.emit('sendPrivateMessage', { sender: username, receiver: selectedUser, text: privateMessage });
            setPrivateMessage('');
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        socket.emit('setStatus', newStatus);
    };

    const searchGifs = async () => {
        if (gifSearch.trim()) {
            try {
                const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
                    params: {
                        api_key: GIPHY_API_KEY,
                        q: gifSearch,
                        limit: 10,
                        offset: 0,
                        rating: 'g',
                        lang: 'fr'
                    }
                });
                setGifs(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la recherche de GIFs:', error);
            }
        }
    };

    const sendGif = (gifUrl) => {
        const msg = { username, text: gifUrl };
        socket.emit('message', msg);
        setGifs([]);  // Effacer les GIFs après l'envoi

        // Appel à scrollToBottom après l'envoi du GIF pour garantir le défilement automatique
        setTimeout(() => {
            scrollToBottom();  // Forcer le scroll après l'envoi du GIF
        }, 100);  // Délai court pour s'assurer que le message est bien rendu
    };

    return (
        <div className="chat-page">
            <div className="online-users">
                <h4>Utilisateurs en ligne :</h4>
                <select onChange={handleStatusChange} value={status}>
                    <option value="online">En ligne</option>
                    <option value="busy">Occupé</option>
                    <option value="offline">Hors ligne</option>
                </select>
                <ul>
                    {onlineUsers.map((user, index) => (
                        <li key={index}>
                            {user.username} ({user.status})
                            <button onClick={() => setSelectedUser(user.username)}>Envoyer MP</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-wrapper">
                <div className="chat-container">
                    <h2>Chat Room</h2>
                    
                    {/* Boîte de chat avec scroll activé */}
                    <div className="chat-messages" ref={chatBoxRef} style={{ overflowY: 'scroll', height: '400px' }}>
                        {chat.map((msg, index) => (
                            <div
                                className={`chat-message ${msg.username === username ? 'chat-message-user' : 'chat-message-other'}`}
                                key={index}
                            >
                                <strong>{msg.username}: </strong>
                                {msg.text.startsWith('http') ? (
                                    <img 
                                        src={msg.text} 
                                        alt="gif" 
                                        className="gif" 
                                        onLoad={scrollToBottom}  // Défilement après le chargement complet du GIF
                                    />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                    </div>

                    <form className="chat-form" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Écris un message..."
                        />
                        <button type="submit">Envoyer</button>
                    </form>

                    <div className="gif-search">
                        <input
                            type="text"
                            value={gifSearch}
                            onChange={(e) => setGifSearch(e.target.value)}
                            placeholder="Rechercher des GIFs..."
                        />
                        <button onClick={searchGifs}>Rechercher</button>
                    </div>

                    {gifs.length > 0 && (
                        <div className="gif-results">
                            {gifs.map(gif => (
                                <img 
                                    key={gif.id} 
                                    src={gif.images.fixed_height_small.url} 
                                    alt={gif.title} 
                                    onClick={() => sendGif(gif.images.fixed_height.url)} 
                                    className="gif" 
                                />
                            ))}
                        </div>
                    )}

                    {selectedUser && (
                        <div>
                            <h4>Envoyer un message privé à {selectedUser}</h4>
                            <form onSubmit={sendPrivateMessage}>
                                <input
                                    type="text"
                                    value={privateMessage}
                                    onChange={(e) => setPrivateMessage(e.target.value)}
                                    placeholder="Message privé..."
                                />
                                <button type="submit">Envoyer MP</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;
