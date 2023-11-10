const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

module.exports = (db) => {
  // Define route handling logic
  router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    // Retrieve the user profile data from Cloudant
    db.get(userId, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving user profile data');
        return;
      }

      if (!data) {
        res.status(404).send('User profile not found');
        return;
      }

      // Read the HTML template from profile.html
      const htmlTemplate = fs.readFileSync('views/profile.html', 'utf-8');

      // Render the HTML template with the retrieved data using EJS
      const profileData = { ...data, userId: userId };
      const renderedHTML = ejs.render(htmlTemplate, profileData);

      res.send(renderedHTML);
    });
  });

  return router;
};
