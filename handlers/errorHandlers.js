const { MulterError } = require("multer");
const Sequelize = require("sequelize");

exports.errorWrapper = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// exports.multerErrorWrapper = (upload) => {
//   return function (req, res, next) {
//     return upload(req, res, function (err) {
//       if (err instanceof MulterError) {
//         const errorDetails = {
//           error: err.message,
//           status: err.status || 500,
//           stack: err.stack,
//         };
//         res.json(err);
//       } else if (err) {
//         res.json(err);
//       } else next();
//     });
//   };
// };

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    error: err.message,
    status: err.status,
    stack: err.stack,
  };
  res.status(err.status || 500).json(errorDetails);
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message, error });
};

exports.notFound = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
};

exports.sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    const errorCodes = err.errors.map((error) => error.message);
    res.status(400).json({
      errors: errorCodes,
    });
    return;
  } else if (err instanceof Sequelize.DatabaseError) {
    const errorCode = err.message;
    res.status(500).json({ errors: errorCode });
  } else {
    next(err);
  }
};

class CustomError extends Error {
  constructor(error, name, status) {
    super(error);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = name;
    this.status = status;
  }
}

exports.CustomError = CustomError;
