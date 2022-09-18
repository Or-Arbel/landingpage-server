const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// this middleware is used before routes that are limited to authenticated users

module.exports = () => {
  return (req, res, next) => {
    console.log('authorization middleware');

    // Find JWT in headers
    const token = req.headers['authorization'];
    if (!token) {
      return next(new AppError('אין אישור לבצע את הפעולה, נא להתחבר ולנסות שוב', 401));
    } else {
      // Validate JWT
      //Bearer tokenBody...
      const tokenBody = token.slice(7);
      jwt.verify(tokenBody, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log(err);
          return next(new AppError('טוקן לא תקין, נא להתחבר שוב', 401));
        }

        // No error, JWT is valid
        // console.log(decoded);

        // check if there is user exists for this token
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
          return next(new AppError('לא נמצא משתמש לטוקן זה, נא להתחבר שוב', 401));
        }
        next();
      });
    }
  };
};
