const APIFeatures = require('../utils/apiFeatures');
const MainLinks = require('../models/mainLinkModel');
const SingleFile = require('../models/singleFileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const removeImage = require('../middlewares/removeImage');
const uploadImage = require('../middlewares/uploadImage');

exports.getAllMainLinks = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  const data = await MainLinks.findAll(query);

  if (!data) {
    return next(new AppError('An error has occurred, could not fetch data', 500));
  }

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getMainLink = catchAsync(async (req, res, next) => {
  const data = await MainLinks.findByPk(req.params.id);

  if (!data) {
    return next(new AppError(recordNotFoundMessage, 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.createMainLinks = catchAsync(async (req, res, next) => {
  try {
    let body = req.body;

    if (req.file) {
      body.image = await uploadImage(req.file);
    }
    const data = await MainLinks.create(body, { validate: true });

    res.status(201).json({
      status: 'success',
      data,
      message: 'הלינק נוסף בהצלחה'
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

exports.updateMainLink = catchAsync(async (req, res, next) => {
  try {
    let body = req.body;
    if (req.file) {
      body.image = await uploadImage(req.file);
    } else {
      await removeImage(MainLinks, req.params.id);
    }
    const data = await MainLinks.update(body, {
      where: { id: +req.params.id },
      validate: true,
      returning: true
    });

    if (data[0] === 0) {
      return next(new AppError(recordNotFoundMessage, 404));
    }

    res.status(200).json({
      status: 'success',
      data: data[1][0].dataValues
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

exports.bulkUpdateMainLink = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      MainLinks.update(row, {
        where: { id: req.body[i].id },
        validate: true,
        returning: true
      })
    );
  }
  const results = await Promise.all(queries);

  const data = results.map(updatedRow => {
    return updatedRow[0] === 0
      ? {
          status: 'fail',
          statusCode: 404,
          message: recordNotFoundMessage
        }
      : {
          status: 'success',
          data: updatedRow[1][0].dataValues
        };
  });

  res.status(200).json({
    status: 'success',
    data,
    message: 'הרשומות עודכנו בהצלחה'
  });
});

exports.deleteMainLink = catchAsync(async (req, res, next) => {
  await removeImage(MainLinks, req.params.id);

  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  const link = await MainLinks.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!link) {
    return next(new AppError(recordNotFoundMessage, 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'הלינק נמחק בהצלחה'
  });
});
