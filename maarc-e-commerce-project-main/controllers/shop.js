const mysql = require("mysql");
const req = require("express/lib/request");
const express = require("express");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maarc_db"
});

function getUsername(req) {
    return req.session.user ? req.session.user.name : null;
}

// Shop route
exports.shop = (req, res) => {
    const username = getUsername(req);
    const searchQuery = req.query.q || '';

    // Fetch the sort parameter from the query string
    const sort = req.query.sort || 'default';
    let orderBy = '';

    // Map sorting options to SQL queries
    switch (sort) {
        case 'price_asc':
            orderBy = 'ORDER BY price ASC';
            break;
        case 'price_desc':
            orderBy = 'ORDER BY price DESC';
            break;
        case 'rating_desc':
            orderBy = 'ORDER BY rating DESC';
            break;
        case 'gender_men':
            orderBy = 'WHERE gender = "Men"';
            break;
        case 'gender_women':
            orderBy = 'WHERE gender = "Women"';
            break;
        default:
            orderBy = '';
    }

    // Construct and execute the query
    let query = `SELECT * FROM products ${orderBy}`;
    if (searchQuery) {
        query += ` WHERE name LIKE '%${searchQuery}%'`; // Add search filter
    }
    db.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send('Database error');
        }

        res.render('shop', {
            username,
            products: results,
            currentSort: sort // Pass the current sort option to the view
        });
    });
};

exports.basket = async (req, res) => {
    const username = req.session.user ? req.session.user.name : null;
    let basket = [];

    basket = req.session.basket;
    console.log(basket);

    const product_arr = []

    const queries = basket.map((itemID) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM products WHERE id = ${itemID}`, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        })
    })

    try{
        const results = await Promise.all(queries);
        product_arr.push(...results);
    } catch (err) {
        console.log(err);
    }

    var total =0.0;
    for (let i = 0; i < product_arr.length; i++) {
        console.log(product_arr[i]);
        total = total + product_arr[i].price
    }


    console.log(product_arr);
    res.render('basket', {username, products: product_arr, total: total});



};

exports.addToBasket = (req, res) => {
    itemID = req.body.id;

    if (req.session.basket){
        req.session.basket.push(itemID);
    }
    else{
        req.session.basket = [];
        req.session.basket.push(itemID);
    }

    res.status(200).json({ message: 'Item added'});
};

// About route
exports.about = (req, res) => {
    const username = getUsername(req);
    res.render('about', { username });
};

// Edit Profile route
exports.editProfile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    const username = getUsername(req);
    res.render('editprofile', { username });
};

// Submit Review route
exports.submitReview = (req, res) => {
    const { productId, rating, review_text } = req.body;

    // Check if the user is logged in
    if (!req.session.user) {
        return res.status(401).send('You must be logged in to submit a review');
    }

    const userId = req.session.user.id; // Get the user ID from the session

    // Insert the review into the database
    const insertReviewQuery = `
        INSERT INTO reviews (product_id, user_id, rating, review_text)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertReviewQuery, [productId, userId, rating, review_text], (error, results) => {
        if (error) {
            console.error('Database Error:', error); // Log the error for debugging
            return res.status(500).send('Error submitting review');
        }

        // Redirect back to the reviews page for the product
        res.redirect(`/reviews/${productId}`);
    });
};

// Index route
exports.index = (req, res) => {
    const username = getUsername(req);
    res.render('index', { username });
};

// Reviews route
exports.reviews = (req, res) => {
    const productId = req.params.productId;
    const username = getUsername(req);

    const productQuery = 'SELECT * FROM products WHERE id = ?';
    const reviewsQuery = `
        SELECT r.rating, r.review_text, u.name AS user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.product_id = ?
    `;

    db.query(productQuery, [productId], (productError, productResults) => {
        if (productError || productResults.length === 0) {
            return res.status(404).send('Product not found');
        }

        db.query(reviewsQuery, [productId], (reviewsError, reviewsResults) => {
            if (reviewsError) {
                console.error('Error fetching reviews:', reviewsError);
                return res.status(500).send('Error fetching reviews');
            }

            res.render('reviews', {
                username,
                product: productResults[0],
                reviews: reviewsResults
            });
        });
    });
};