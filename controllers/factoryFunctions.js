const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const uploadImage = require('../middlewares/uploadImage');
const removeImage = require('../middlewares/removeImage');

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

exports.getOneById = (Model, notFoundMessage) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id);

    if (!data) {
      return next(new AppError(notFoundMessage, 404));
    }

    res.status(200).json({
      status: 'success',
      data
    });
  });

exports.updateOneById = (Model, notFoundMessage) =>
  catchAsync(async (req, res, next) => {
    try {
      let body = req.body;

      if (req.file) {
        body.image = await uploadImage(req.file);
      } else {
        await removeImage(Model, req.params.id);
      }

      const data = await Model.update(body, { where: { id: req.params.id }, validate: true, returning: true });
      if (data[0] === 0) {
        return next(new AppError(notFoundMessage, 404));
      }

      res.status(200).json({
        status: 'success',
        data: data[1][0]
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
