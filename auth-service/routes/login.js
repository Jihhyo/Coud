const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route de connexion
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe sont obligatoires.' });
    }

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
        .then(([results]) => {
            if (results.length === 0) {
                return res.status(401).json({ message: 'Pseudo ou mot de passe incorrect.' });
            }
            res.status(200).json({ message: 'Connexion réussie !', user: results[0] });
        })
        .catch(err => {
            console.error('Erreur de requête SQL:', err);
            res.status(500).json({ message: 'Erreur serveur.' });
        });
});

module.exports = router;
