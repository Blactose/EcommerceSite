const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// Route for displaying the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration form submission
router.post('/register', authController.handleRegister);

// Route for displaying the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form submission
router.post('/login', authController.handleLogin);

// Handle user logout
router.get('/logout', authController.logout);

// Handle account deletion
router.get('/delete', authController.delete);

// User Account Update Routes
router.post('/update-name', authController.updateName);
router.post('/update-email', authController.updateEmail);
router.post('/update-password', authController.updatePassword);

module.exports = router;
