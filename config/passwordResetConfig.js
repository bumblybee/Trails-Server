let resetPasswordUrl;

if (process.env.NODE_ENV === "development") {
  resetPasswordUrl = "http://localhost:3000/reset-password";
}

// if (process.env.NODE_ENV === "production") {
//   resetPasswordUrl = "https://challengeboard.xyz/reset-password";
// }

exports.RESET_PASSWORD_URL = resetPasswordUrl;
