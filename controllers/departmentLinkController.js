const APIFeatures = require('../utils/apiFeatures');
const DepartmentLinks = require('../models/departmentLinkModel');
const Departments = require('../models/departmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllDepartmentLinks = catchAsync(async (req, res, next) => {
  const { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  query.include = [
    {
      model: Departments
    }
  ];

  const data = await DepartmentLinks.findAll(query);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getDepartmentLink = catchAsync(async (req, res, next) => {
  const data = await DepartmentLinks.findByPk(req.params.id);

  if (!data) {
    return next(new AppError('No department found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.createDepartmentLinks = catchAsync(async (req, res, next) => {
  const data = await DepartmentLinks.create(req.body, { validate: true });

  res.status(201).json({
    status: 'success',
    data,
    message: 'הלינק נוסף בהצלחה'
  });
});

exports.updateDepartmentLink = catchAsync(async (req, res, next) => {
  const update = await DepartmentLinks.update(req.body, {
    where: { id: req.params.id },
    validate: true,
    returning: true
  });

  if (update[0] === 0) {
    return next(new AppError('No department link found with that ID', 404));
  }

  // console.log(update[1]);
  const data = update[1][0];

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.bulkUpdateDepartmentLinks = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      DepartmentLinks.update(row, {
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

exports.deleteDepartmentLink = catchAsync(async (req, res, next) => {
  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  const departmentLink = await DepartmentLinks.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!departmentLink) {
    return next(new AppError('No department link found with that ID', 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'הלינק נמחק בהצלחה'
  });
});
