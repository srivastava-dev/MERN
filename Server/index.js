const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'username', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'crud'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Middleware for validating email uniqueness
const validateEmailUniqueness = (req, res, next) => {
    console.log(req);
    const { email } = req.body;
    const userId = req.params.id || null;
    let sql = 'SELECT * FROM users WHERE email = ?';
    let params = [email];

    // If userId is provided, exclude this user from the uniqueness check
    if (userId) {
        sql += ' AND Id != ?';
        params.push(userId);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ success: false, message: 'Email already exists' });
            return;
        }
        next();
    });
};

// Validation rules for create user endpoint
const createUserValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    validateEmailUniqueness
];
const updateUserValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    validateEmailUniqueness
];

// Create Users
app.post('/users', createUserValidationRules, (req, res) => {
    const { name, email } = req.body;
    const user = { name, email };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.status(200).json({ success: true, message: 'User created successfully', Id: parseInt(result.insertId), name, email });
    });
});

// Get all users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.status(200).json({ success: true, message: 'Users fetched successfully', data: results });
    });
});

// Get Edit  users
app.get('/user/:id', (req, res) => {
    const sql = 'SELECT * FROM users where Id = ?';
    db.query(sql, [name, email, req.params.id], (err, result) => {
        if (err) {
            console.error('Error retrieving users:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.status(200).json({ success: true, message: 'User Record fetched successfully', data: results });
    });
});
// Update a user
app.put('/users/:id',updateUserValidationRules, (req, res) => {
    const { name, email } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE Id = ?';
    db.query(sql, [name, email, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.status(200).json({ success: true, message: 'User updated successfully', id: parseInt(req.params.id), name, email });
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE Id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted successfully', id: parseInt(req.params.id) });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
