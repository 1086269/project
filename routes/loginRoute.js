const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

module.exports = (db) => {
  // Define route handling logic
    router.get('/', (req, res) => {
        const htmlTemplate = fs.readFileSync('views/login.html', 'utf-8');
        const renderedHTML = ejs.render(htmlTemplate, {});

        res.send(renderedHTML);
    });

    router.post('/', (req, res) => {
        // console.log("login", req);
        const { username, password } = req.body;

        // Implement your login logic here, e.g., querying the database
        // and validating the credentials.

        // Example: Check if the user exists in the database
        db.find({ selector: { username, password } }, (err, result) => {
            if (err) {
                // console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (result.docs.length === 1) {
                // console.log("login result", result.docs);
                // Successful login
                res.redirect("/profile/" + result.docs[0]._id);
            } else {
                // Failed login
                res.send('Login failed');
            }
        });
    });

    return router;
};
