const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files like HTML

// Relative path for the simulated database file (users.json)
const dbFile = path.join(__dirname, 'users.json');

// Route to handle signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Read existing users from the JSON file
    fs.readFile(dbFile, (err, data) => {
        if (err) return res.status(500).send('Error reading database.');
        
        let users = [];
        if (data.length > 0) {
            users = JSON.parse(data);  // Parse existing users
        }

        // Check if the user already exists
        if (users.some(user => user.username === username)) {
            return res.status(400).send('User already exists!');
        }

        // Add new user to the users array
        users.push({ username, password });

        // Write updated users back to the JSON file
        fs.writeFile(dbFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving user.');
            res.send('User signed up successfully!');
        });
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read users from the JSON file
    fs.readFile(dbFile, (err, data) => {
        if (err) return res.status(500).
