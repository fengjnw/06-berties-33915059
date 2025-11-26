// Create a new router
const express = require("express")
const router = express.Router()
const redirectLogin = require('./users').redirectLogin; // import the redirectLogin middleware
const { check, validationResult } = require('express-validator');

// Handle search page request
router.get('/search', function (req, res, next) {
    res.render("search.ejs")
});

// Handle search requests
router.get('/search_result', [
    check('search_text').notEmpty(),
    check('search_mode').notEmpty()
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('./search');
    } else {
        [search_text, search_mode] = req.sanitize([req.query.search_text, req.query.search_mode]);
        //searching in the database
        // build query and search term, depending on search mode
        const isExact = search_mode === 'Exact Match';
        // if Exact Match is selected, we use '=' operator
        // if Partial Match is selected, we use 'LIKE' operator with wildcards
        const sqlquery = isExact
            ? "SELECT * FROM books WHERE name = ?"
            : "SELECT * FROM books WHERE name LIKE ?";
        // if Exact Match is selected, we use the term as is
        // if Partial Match is selected, we wrap the term with '%' wildcards
        const searchTerm = isExact
            ? search_text
            : '%' + search_text + '%';
        // execute sql query
        db.query(sqlquery, [searchTerm], (err, result) => {
            if (err) {
                next(err)
            }
            // if no books found, inform the user
            if (result.length === 0) {
                res.send("No books found." + "<br>" + "<a href='/books/search'>Back</a>");
                return;
            }
            res.render("search_result.ejs", { searched_books: result, search_text: search_text, search_mode: search_mode })
        });
    }
});

// Handle list books request
router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        // if no books found, inform the user
        if (result.length === 0) {
            res.send("No books for now." + "<br>" + "<a href='/'>Back</a>");
            return;
        }
        res.render("book_list.ejs", { availableBooks: result })
    });
});

router.get('/addbook', redirectLogin, function (req, res, next) {
    res.render("addbook.ejs")
});

// Handle add book request
router.post('/bookadded', redirectLogin, [
    // Validation rules
    check('name').notEmpty(),
    check('price').notEmpty(),
    check('price').isFloat({ min: 0 })
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('./addbook');
    } else {
        let [name, price] = req.sanitize([req.body.name, req.body.price]);
        const priceFloat = parseFloat(price);
        if (!Number.isFinite(priceFloat) || priceFloat < 0) {
            res.send("Please enter a non-negative price for the book." + "<br>" + "<a href='/books/addbook'>Back</a>");
            return;
        }
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
        // execute sql query
        let newrecord = [name, priceFloat]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                res.send(' This book is added to database, name: ' + name + ' price ' + priceFloat + '<br>' + '<a href="/books/addbook">Add another book</a>');
        })
    }
});

// Handle bargain books request
router.get('/bargainbooks', function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all the books cheaper than 20
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        // if no books found, inform the user
        if (result.length === 0) {
            res.send("No books on bargain offer for now." + "<br>" + "<a href='/'>Back</a>");
            return;
        }
        res.render("bargainbooks.ejs", { bargainBooks: result })
    });
});

// Handle delete book request
router.get('/delete/:id', redirectLogin, function (req, res, next) {
    let bookId = req.sanitize(req.params.id);
    let sqlquery = "DELETE FROM books WHERE id = ?"; // query database to delete the book with the specified id
    // execute sql query
    db.query(sqlquery, [bookId], (err, result) => {
        if (err) {
            next(err)
        } else {
            res.redirect('../list');
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
