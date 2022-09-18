const { Sequelize, Op } = require('sequelize');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const { SQL_HOST, SQL_PORT, SQL_USER, SQL_PASSWORD, SQL_DB, SQL_DIALECT } = process.env;

const sequelize = new Sequelize(SQL_DB, SQL_USER, SQL_PASSWORD, {
  host: SQL_HOST,
  // port: SQL_PORT,
  dialect: SQL_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: {
    // Comparison
    $gte: Op.gte, // Matches values that are greater than or equal to a specified value.
    $gt: Op.gt, // Matches values that are greater than a specified value.
    $lte: Op.lte, // Matches values that are less than or equal to a specified value.
    $lt: Op.lt, // Matches values that are less than a specified value.
    $eq: Op.eq, // Matches values that are equal to a specified value.
    $ne: Op.ne, // Matches all values that are not equal to a specified value.
    // Logical
    $and: Op.and, // Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
    $not: Op.not, // Inverts the effect of a query expression and returns documents that do not match the query expression.
    $or: Op.or // Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
  }
});

module.exports.sequelize = sequelize;

(async () => {
  if (process.env.NODE_ENV === 'development') {
    await sequelize
      .sync
      // { force: true }
      ();
    console.log('alter re-sync DB.');
  } else {
    await sequelize.sync({ alter: true });
    console.log('alter re-sync DB.');
  }
})();

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  sequelize.close().then(() => process.exit(1));
});
