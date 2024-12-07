const mysql = require("mysql");
const bcrypt = require("bcryptjs"); // Using bcryptjs for hashing

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "maarc_db"
});

exports.handleRegister = (req, res) => {
    console.log(req.body);

    const { name, email, password } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        }

        // Hash the password before inserting it into the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error hashing password');
            };

            // Insert the user with the hashed password
            db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register', {
                        message: 'User registered successfully'
                    });
                }
            });
        });
    });
};

exports.handleLogin = (req, res) => {

    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'email or password is incorrect'
            });
        }

        // Use bcrypt to compare the provided password with the stored hashed password
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error comparing passwords');
            }

            if (isMatch) {
                req.session.user = {
                    id: results[0].id,
                    email: results[0].email,
                    name: results[0].name
                };
                console.log(req.session.user);
                return res.redirect('/index');
            } else {
                return res.render('login', {
                    message: 'Email or password is incorrect'
                });
            }
        });
    });
};

// Logout handler
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/index'); 
    });
};

// Delete account handler
exports.delete = (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('You need to be logged in to delete your account.');
    }

    const email = req.session.user.email;

    db.query('DELETE FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error deleting user');
        }

        if (results.affectedRows === 0) {
            return res.render('index', {
                message: 'User not found'
            });
        } else {
            console.log(`User with email ${email} deleted successfully`);
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send('Error during logout');
                }
                return res.redirect('/index');
            });
        }
    });
};

// Accounts page

function ensureAuthenticated(req, res, next) { // Middleware for authentication check
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

exports.updateName = (req, res) => {
    const newName = req.body.name;
    const userId = req.session.user.id;

    db.query('UPDATE users SET name = ? WHERE id = ?', [newName, userId], (err, result) => {
        if (err) {
            console.error('Error updating name:', err);
            return res.status(500).send('Error updating name');
        }

        if (result.affectedRows === 0) {
            return res.status(400).send('No user found to update');
        }

        // Update the session data with the new name
        req.session.user.name = newName;

        // Pass the updated user to the template
        res.render('editprofile', { username: req.session.user.name });
    });
};

exports.updateEmail = (req, res) => {
    const newEmail = req.body.email;
    const userId = req.session.user.id;

    db.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], (err, result) => {
        if (err) {
            console.error('Error updating email:', err);
            return res.status(500).send('Error updating email');
        }
        res.redirect('/editprofile');
    });
};

exports.updatePassword = (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;

    if (newPassword !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) {
            console.error('Error fetching current password:', err);
            return res.status(500).send('Error fetching current password');
        }

        const storedPassword = results[0].password;
        const isMatch = await bcrypt.compare(currentPassword, storedPassword);
        if (!isMatch) {
            return res.status(400).send('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).send('Error updating password');
            }
            res.redirect('/editprofile?success=true');
        });
    });
};


