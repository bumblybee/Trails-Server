const AWS = require("aws-sdk");

const s3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

// !! Should return a promise with s3 object with location urls and keys

// TODO: Be sure to pass in file when calling in TrailsController

exports.uploadToS3 = async (file) => {
  const params = {
    Acl: "public-read",
    Bucket: process.env.S3_BUCKET,
    Key: " " + file.originalname,
    Body: file.buffer,
  };

  const s3Upload = await s3Client.upload(params);

  return s3Upload;
};

//TODO: Create function export to handle getting files from s3
