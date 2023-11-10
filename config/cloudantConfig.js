const Cloudant = require('@cloudant/cloudant');

// Configure Cloudant
const cloudant = Cloudant({
  url: 'https://a312a0e0-0fd1-4839-9a8e-a6d05945fe6f-bluemix.cloudantnosqldb.appdomain.cloud',
  plugins: { iamauth: { iamApiKey: 'xuLVquQxY1VvhDd5QuwYhqtGCv6KGHbv2m0M4w85Lc7w' } }
});

module.exports = cloudant;
