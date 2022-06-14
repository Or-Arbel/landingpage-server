const AppError = require('./../utils/appError');

const fixMessage = message => {
  return message
    .replaceAll('notNull Violation: ', '')
    .replaceAll('Validation error: ', '')
    .replaceAll('\n', ' ')
    .replaceAll('.', ' ');
};

const handleCastErrorDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Invalid field ID: ${value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const fieldName = Object.keys(err.fields)[0];
  const fieldvalue = Object.values(err.fields)[0];
  const message = `Duplicate field value: ${fieldName} = ${fieldvalue}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors)
    .map(el => fixMessage(el.message))
    .join('. ');
  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: fixMessage(err.message || err.errors[0].message),
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'SequelizeDatabaseError') error = handleCastErrorDB(error);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
    if (error.name === 'AggregateError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
