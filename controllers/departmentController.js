const APIFeatures = require('../utils/apiFeatures');
const Department = require('../models/departmentModel');
const DepartmentLinks = require('../models/departmentLinkModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllDepartments = catchAsync(async (req, res, next) => {
  let { query } = new APIFeatures(req.query)
    .filter()
    .order()
    .limitFields()
    .paginate();

  query.include = [
    {
      model: DepartmentLinks,
      required: false
    }
  ];

  const data = await Department.findAll(query);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  const data = await Department.findByPk(req.params.id);

  if (!data) {
    return next(new AppError('No department found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.createDepartment = catchAsync(async (req, res, next) => {
  const data = await Department.bulkCreate(req.body, { validate: true });

  res.status(201).json({
    status: 'success',
    results: data.length,
    data,
    message: 'המחלקה נוספה בהצלחה'
  });
});

exports.updateDepartment = catchAsync(async (req, res, next) => {
  const update = await Department.update(req.body, {
    where: { id: req.params.id },
    validate: true,
    returning: true
  });

  if (update[0] === 0) {
    return next(new AppError('No department found with that ID', 404));
  }

  const data = update[1];

  res.status(200).json({
    status: 'success',
    data,
    message: 'עודכן בהצלחה'
  });
});

exports.bulkUpdateDepartment = catchAsync(async (req, res, next) => {
  const { body } = req;

  const queries = [];

  for (let i = 0; i < body.length; i++) {
    const row = { ...req.body[i] };
    delete row.id;

    queries.push(
      Department.update(row, {
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

exports.deleteDepartment = catchAsync(async (req, res, next) => {
  // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
  const link = await Department.destroy({ where: { id: JSON.parse(req.params.id) } });

  if (!department) {
    return next(new AppError('No department found with that ID', 404));
  }

  res.status(202).json({
    status: 'success',
    data: null,
    message: 'המחלקה נמחקה בהצלחה'
  });
});
