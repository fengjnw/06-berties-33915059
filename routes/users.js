// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // validate input
    if (!req.body.username || !req.body.first || !req.body.last || !req.body.email || !req.body.password) {
        res.send("Please provide username, first name, last name, email, and password.");
        return;
    }
    // hash password
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        // Store hashed password in your database
        if (err) {
            res.send("Error hashing password.");
            return;
        }
        // saving data in database
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)"
        // execute sql query
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else {
                result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered!  We will send an email to you at ' + req.body.email;
                result += '\nYour password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
                res.send(result);
            }
        });
    })
});

// Handle list users request
router.get('/list', function (req, res, next) {
    // Code to retrieve and display list of users from the database would go here
    let sqlquery = "SELECT * FROM users"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        // if no books found, inform the user
        if (result.length === 0) {
            res.send("No users for now." + "<br>" + "<a href='/'>Back</a>");
            return;
        }
        res.render("user_list.ejs", { users: result })
    });
});

// Handle delete user request
router.get('/delete/:id', function (req, res, next) {
    let userId = req.params.id;
    let sqlquery = "DELETE FROM users WHERE id = ?"; // query database to delete the user with the specified id
    // execute sql query
    db.query(sqlquery, [userId], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.send('User with ID ' + userId + ' has been deleted.<br><a href="/users/list">Back to User List</a>');
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
