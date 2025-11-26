const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        req.session.returnTo = req.originalUrl; // save the page user wanted to visit
        req.session.loginMessage = 'Please login to access this page'; // save message to display
        // Use relative redirect that works from both /books/* and /users/* routes
        const loginPath = req.originalUrl.startsWith('/books') ? '../users/login' : './login';
        res.redirect(loginPath);
    } else {
        next(); // move to the next middleware function
    }
}

module.exports = { redirectLogin };
