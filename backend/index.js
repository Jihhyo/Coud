const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Assurez-vous d'utiliser './config/db'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',  // Autoriser les requêtes du frontend
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(bodyParser.json());

let connectedUsers = {};




// Route pour récupérer tous les messages privés
app.get('/private_messages', (req, res) => {
    db.query('SELECT * FROM private_messages ORDER BY timestamp DESC')
        .then(([results]) => {
            res.status(200).json({ messages: results });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des messages privés:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des messages privés' });
        });
});


// Route pour récupérer tous les messages
app.get('/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY timestamp ASC')
        .then(([results]) => {
            res.status(200).json({ messages: results });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des messages:', err);
            res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
        });
});


// Logique de Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    // Envoyer les messages existants lors de la connexion d'un nouvel utilisateur
    const fetchMessages = async () => {
        try {
            const [results] = await db.query('SELECT * FROM messages ORDER BY timestamp ASC');
            socket.emit('loadMessages', results); // Envoi des messages à l'utilisateur connecté
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    fetchMessages(); // Appel de la fonction pour charger les messages

    socket.on('setUsername', (username) => {
        if (!connectedUsers[socket.id]) {
            connectedUsers[socket.id] = { username, status: 'online' };
            console.log(`Utilisateur connecté: ${username}`);

            // Envoyer un message dans le chat pour informer de la nouvelle connexion
            io.emit('message', { username: 'Général', text: `${username} vient de rejoindre le salon` });
        }
        io.emit('usersOnline', Object.values(connectedUsers));
    });

    socket.on('message', async (msg) => {
        const username = connectedUsers[socket.id]?.username;
        if (username) {
            const messageData = { username, text: msg.text };

            // Insérer le message dans la base de données
            try {
                await db.query('INSERT INTO messages (username, text) VALUES (?, ?)', [username, msg.text]);
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du message:', error);
            }

            io.emit('message', messageData);
        }
    });


    // Messages privés
    socket.on('sendPrivateMessage', (msg) => {
        const { sender, receiver, text } = msg;
        const timestamp = new Date();

        // Enregistrer le message privé dans la base de données
        db.query(
            'INSERT INTO private_messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)',
            [sender, receiver, text, timestamp]
        )
            .then(() => {
                const receiverSocketId = Object.keys(connectedUsers).find(key => connectedUsers[key].username === receiver);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('privateMessage', { sender, receiver, text });
                }
            })
            .catch(err => {
                console.error('Erreur lors de l\'enregistrement du message privé:', err);
            });
    });

    socket.on('setStatus', (status) => {
        if (connectedUsers[socket.id]) {
            connectedUsers[socket.id].status = status;
            io.emit('usersOnline', Object.values(connectedUsers));  // Diffuser la mise à jour à tous les utilisateurs
        }
    });

    socket.on('disconnect', () => {
        console.log(`Un utilisateur s'est déconnecté`);
        delete connectedUsers[socket.id];
        io.emit('usersOnline', Object.values(connectedUsers));
    });
});

// Démarrer le serveur
server.listen(5000, () => {
    console.log('Serveur écoute sur le port 5000');
});
