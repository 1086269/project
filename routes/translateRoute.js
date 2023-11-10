const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

// please make paymebnt for current mentoring, we spent 50mins
// 100USD -- Do you have pyapal?
// smartcode121@outlook.com

module.exports = (languageTranslator) => {
  // Define route handling logic
    
    router.post('/translate', async (req, res) => {
        // console.log("translate", req.body);
        const { text, language } = req.body;

        const translationParams = {
            text: text,
            source: "en",
            target: language,
          };
        
          try {
            const translationResult = await languageTranslator.translate(translationParams);
            return res.json(translationResult.result.translations[0]);
          } catch (error) {
            console.error('Error translating text:', error);
            return text; // Return original text in case of error
          }

    });

    return router;
};
