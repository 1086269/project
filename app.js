const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//const favicon = require('serve-favicon');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Cloudant
const cloudant = require('./config/cloudantConfig');
const db = cloudant.use('user-profile');

// Configure Language Translator
const languageTranslator = require('./config/languageTranslatorConfig');

// Import routes
const profileRoute = require('./routes/profileRoute')(db);
const medicationRoute = require('./routes/medicationRoute')(db, languageTranslator);
const loginRoute = require('./routes/loginRoute')(db);
const apiRoute = require('./routes/translateRoute');
const translateRoute = require('./routes/translateRoute')(languageTranslator);
// Serve static files from the 'public' directory "css"
app.use(express.static(path.join(__dirname, 'public')));
// const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'profile.html'), 'utf-8');


// Use routes
app.use('/profile', profileRoute);
app.use('/medication', medicationRoute);
app.use('/login', loginRoute);
app.use('/api', translateRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
