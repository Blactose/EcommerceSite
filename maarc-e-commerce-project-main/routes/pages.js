const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const shopController = require('../controllers/shop')



router.get('/index', shopController.index);

router.get('/editprofile', shopController.editProfile);

router.get('/about', shopController.about);

router.get('/basket', shopController.basket);
router.post('/add-to-basket', shopController.addToBasket);


// Routes for various pages and actions
router.get('/index', shopController.index);           // Index page
router.get('/editprofile', shopController.editProfile); // Edit profile page
router.get('/about', shopController.about);             // About page
router.get('/basket', shopController.basket);           // Basket page
router.get('/shop', shopController.shop);               // Shop page
router.get('/reviews/:productId', shopController.reviews); // Reviews page for a specific product
router.get('/shop', shopController.shop);


// Route to submit a review
router.post('/reviews/submit-review', shopController.submitReview);

module.exports = router;