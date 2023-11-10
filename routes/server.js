// //----------------------------------------------
// const express = require('express');
// const Cloudant = require('@cloudant/cloudant');
// const ejs = require('ejs');
// const fs = require('fs');

// const app = express();
// const port = process.env.PORT || 3000;

// // Configure Cloudant
// const cloudant = Cloudant({
//   url: 'https://a312a0e0-0fd1-4839-9a8e-a6d05945fe6f-bluemix.cloudantnosqldb.appdomain.cloud',
//   plugins: { iamauth: { iamApiKey: 'xuLVquQxY1VvhDd5QuwYhqtGCv6KGHbv2m0M4w85Lc7w' } }
// });
// const db = cloudant.use('user-profile');

// app.use(express.static('public'));

// app.get('/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Retrieve the user profile data from Cloudant
//   db.get(userId, (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving user profile data');
//       return;
//     }

//     if (!data) {
//       res.status(404).send('User profile not found');
//       return;
//     }

//     // Read the HTML template from profile.html
//     const htmlTemplate = fs.readFileSync('profile.html', 'utf-8');

//     // Render the HTML template with the retrieved data using EJS
//     const profileData = { ...data, userId: '001' };

//     const renderedHTML = ejs.render(htmlTemplate, profileData);

//     res.send(renderedHTML);
//   });
// });

// app.get('/medication/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Retrieve the user profile data from Cloudant
//   db.get(userId, (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving user profile data');
//       return;
//     }

//     if (!data) {
//       res.status(404).send('User profile not found');
//       return;
//     }

//     // Read the HTML template from medication.html
//     const htmlTemplate = fs.readFileSync('medication.html', 'utf-8');
//     const profileData = data;
//     const renderedHTML = ejs.render(htmlTemplate, profileData);
//     res.send(renderedHTML);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
////////////-------------------------------------------------------- 
const express = require('express');
const Cloudant = require('@cloudant/cloudant');
const ejs = require('ejs');
const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 3000;


// Configure Cloudant
const cloudant = Cloudant({
  url: 'https://a312a0e0-0fd1-4839-9a8e-a6d05945fe6f-bluemix.cloudantnosqldb.appdomain.cloud',
  plugins: { iamauth: { iamApiKey: 'xuLVquQxY1VvhDd5QuwYhqtGCv6KGHbv2m0M4w85Lc7w' } }
});
const db = cloudant.use('user-profile');

// Configure Language Translator
const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'C7b53KQb3PErdOVx5GXygE2MCBS5dXjn6zJg5XI0vimE',
  }),
  serviceUrl: 'https://api.au-syd.language-translator.watson.cloud.ibm.com/instances/56a2eac0-71cf-4bd2-a69e-cae55492b264',
});

async function translateText(text, sourceLanguage, targetLanguage) {
  if (sourceLanguage === targetLanguage) {
    console.error('Source language should not be equal to target language');
    return text;
  }

  const translationParams = {
    text: text,
    source: sourceLanguage,
    target: targetLanguage,
  };

  try {
    const translationResult = await languageTranslator.translate(translationParams);
    return translationResult.result.translations[0].translation;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text in case of error
  }
}



app.use(express.static('public'));

app.get('/:userId', (req, res) => {
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
    const htmlTemplate = fs.readFileSync('/Users/asma/Desktop/cloud computing/medical/views/profile.html', 'utf-8');

    // Render the HTML template with the retrieved data using EJS
    const profileData = { ...data, userId: '001' };

    const renderedHTML = ejs.render(htmlTemplate, profileData);

    res.send(renderedHTML);
  });
});

app.get('/medication/:userId', async (req, res) => {
  const userId = req.params.userId;
  const sourceLanguage = 'en'; // Default language is English

  // Retrieve the user profile data from Cloudant
  db.get(userId, async (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving user profile data');
      return;
    }

    if (!data) {
      res.status(404).send('User profile not found');
      return;
    }

    // Read the HTML template from medication.html
    const htmlTemplate = fs.readFileSync('/Users/asma/Desktop/cloud computing/medical/views/medication.html', 'utf-8');

    // Render the HTML template with the retrieved data using EJS
    const profileData = data;
    let renderedHTML = ejs.render(htmlTemplate, profileData);

    res.send(renderedHTML);
  });
});

app.use(express.json());

app.post('/api/translate', async (req, res) => {
    const { text, language } = req.body;

    // Call the translateText function to get the translated text
    const translatedText = await translateText(text, 'en', language);

    // Send the translated text as the response
    res.json({ translation: translatedText });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
