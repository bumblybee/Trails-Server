const aws = require("aws-sdk");

exports.s3Config = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});
