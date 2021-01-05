const authService = require("../services/authService");
const { CustomError } = require("../handlers/errorHandlers");
const COOKIE_CONFIG = require("../config/cookieConfig").COOKIE_CONFIG;

exports.signupUser = async (req, res) => {
  const { email, username, password } = req.body;

  const { jwt, userData: user } = await authService.signupUser(
    email,
    username,
    password
  );

  if (user) {
    res.cookie("jwt", jwt, COOKIE_CONFIG);

    res.json(user);
  } else {
    res.json({ error });
  }
};
