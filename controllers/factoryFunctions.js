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

exports.getAll = (Model, includeProperties) =>
  catchAsync(async (req, res, next) => {
    console.log('hi');
    let { query } = new APIFeatures(req.query)
      .filter()
      .order()
      .limitFields()
      .paginate();

    if (includeProperties) query.include = includeProperties;

    const data = await Model.findAll(query);
    console.log(data);

    res.status(200).json({
      status: 'success',
      results: data.length,
      data
    });
  });

exports.updateOneById = (Model, notFoundMessage) =>
  catchAsync(async (req, res, next) => {
    try {
      let body = req.body;

      if (req.file) {
        body.image = await uploadImage(req.file);
      }

      if (!req.file && !req.body.image) {
        // if user removed the image (if req.params.image === null)
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

exports.bulkUpdate = Model =>
  catchAsync(async (req, res, next) => {
    const { body } = req;

    const queries = [];

    for (let i = 0; i < body.length; i++) {
      const row = { ...req.body[i] };
      delete row.id;

      queries.push(
        Model.update(row, {
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

exports.deleteOneOrMany = (Model, notFoundMsg, successMsg) =>
  catchAsync(async (req, res, next) => {
    // delete one OR many records: .../route/2065 OR .../route/[2065, 2066, 2067]
    await removeImage(Model, req.params.id);
    const data = await Model.destroy({ where: { id: JSON.parse(req.params.id) } });

    if (!data) {
      return next(new AppError(notFoundMsg, 404));
    }

    res.status(202).json({
      status: 'success',
      data: null,
      message: successMsg
    });
  });
