// sickLeaveRoute.js

const express = require('express');
const AWS = require('ibm-cos-sdk');

const router = express.Router();

// Set your IBM Cloud Object Storage credentials
const config = {
  endpoint: 'https://s3.eu-de.cloud-object-storage.appdomain.cloud',
  apiKeyId: 'xJr5NzolV3zU6DYvNcxUWJSZsrxmu1wvmqtcsvxo5lar',
  ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  serviceInstanceId: 'crn:v1:bluemix:public:cloud-object-storage:global:a/b1fa14d19ef044959671a32cc4922c02:4a56626b-628c-494a-9007-5067db2ca847::',
};

// Create an instance of the SDK
const cos = new AWS.S3(config);

// Define a route for downloading the sick leave PDF
router.get('/sick-leave', (req, res) => {
  const bucketName = 'sickleaves';
  const objectKey = 'sick_leave_report.pdf'; // Update with the actual object key of your PDF

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  // Create a read stream from the IBM Cloud Object Storage
  const downloadStream = cos.getObject(params).createReadStream();

  // Set the response headers for the file download
  res.setHeader('Content-Disposition', `attachment; filename=${objectKey}`);
  res.setHeader('Content-Type', 'application/pdf');

  // Pipe the file stream to the response
  downloadStream.pipe(res);
});

module.exports = router;
