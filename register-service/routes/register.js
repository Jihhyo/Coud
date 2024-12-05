const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Pseudo et mot de passe sont obligatoires.' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username])
        .then(([results]) => {
            if (results.length > 0) {
                return res.status(400).json({ message: 'Ce pseudo est déjà utilisé.' });
            }

            return db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        })
        .then(() => res.status(201).json({ message: 'Compte créé avec succès.' }))
        .catch(err => {
            console.error('Erreur lors de la création du compte:', err);
            res.status(500).json({ message: 'Erreur serveur.' });
        });
});

module.exports = router;
