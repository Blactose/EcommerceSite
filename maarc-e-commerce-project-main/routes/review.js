const mysql = require('mysql');
const express = require('express');
const router = express.Router();

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'maarc_db'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// Handle review submission
router.post('/submit-web-review', (req, res) => {
    const { rating, review } = req.body;

    // Check if both rating and review are provided
    if (!rating || !review) {
        return res.status(400).json({ message: 'Rating and review are required.' });
    }

    // Insert the review into the database
    const sql = 'INSERT INTO webreviews (rating, review) VALUES (?, ?)';
    db.query(sql, [rating, review], (err, result) => {
        if (err) {
            console.error('Error inserting review:', err);
            return res.status(500).json({ message: 'Failed to insert review.' });
        }
        // Send success response with the inserted review ID
        res.status(200).json({ message: 'Review submitted successfully!', reviewId: result.insertId });
    });
});

module.exports = router;
