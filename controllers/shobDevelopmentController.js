const APIFeatures = require('../utils/apiFeatures');
const ShobDevelopments = require('../models/shobDevelopmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllShobDevelopments = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  const data = await ShobDevelopments.findAll(query);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getShobDevelopment = catchAsync(async (req, res, next) => {
  const data = await ShobDevelopments.findByPk(req.params.id);

  if (!data) {
    return next(new AppError('No shob development found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.createShobDevelopments = catchAsync(async (req, res, next) => {
  const data = await ShobDevelopments.bulkCreate(req.body, { validate: true });
  console.log(data);

  res.status(201).json({
    status: 'success',
    results: data.length,
    data,
    message: 'פיתוח המעבדה נוסף בהצלחה'
  });
});

exports.updateShobDevelopment = catchAsync(async (req, res, next) => {
  const update = await ShobDevelopments.update(req.body, {
    where: { id: +req.params.id },
    validate: true,
    returning: true
  });

  if (update[0] === 0) {
    return next(new AppError('No shob development found with that ID', 404));
  }

  const data = update[1][0].dataValues;

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.bulkUpdateShobDevelopment = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      ShobDevelopments.update(row, {
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

exports.deleteShobDevelopment = catchAsync(async (req, res, next) => {
  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  const shobDevelopment = await ShobDevelopments.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!shobDevelopment) {
    return next(new AppError('No shob development found with that ID', 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'פיתוח המעבדה נמחק בהצלחה'
  });
});
