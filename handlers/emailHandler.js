const nodemailer = require("nodemailer");
const ejs = require("ejs");
const juice = require("juice");

const { CustomError } = require("../handlers/errorHandlers");

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const generateHTML = async (filename, options) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/email/${filename}.ejs`,
    options
  );
  return juice(html);
};

exports.sendEmail = async (options) => {
  try {
    const html = await generateHTML(options.filename, options);

    const mailOptions = {
      from: "TrailScout <hesstjune@gmail.com>",
      to: options.user.email,
      subject: options.subject,
      html,
    };

    return transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
