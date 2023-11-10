const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

// Configure Language Translator
const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'C7b53KQb3PErdOVx5GXygE2MCBS5dXjn6zJg5XI0vimE',
  }),
  serviceUrl: 'https://api.au-syd.language-translator.watson.cloud.ibm.com/instances/56a2eac0-71cf-4bd2-a69e-cae55492b264',
});

module.exports = languageTranslator;
