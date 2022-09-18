const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model, successMessage) =>
  catchAsync(async (req, res, next) => {
    try {
      let body = req.body;

      if (req.file) {
        body.image = await uploadImage(req.file);
      }

      const data = await Model.create(body, { validate: true });

      res.status(201).json({
        status: 'success',
        data,
        message: successMessage
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
