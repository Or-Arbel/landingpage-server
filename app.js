const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const linkRouter = require('./routes/linkRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const departmentLinkRouter = require('./routes/departmentLinkRoutes');
const shobDevelopmentRouter = require('./routes/shobDevelopmentRoutes');
const userRouter = require('./routes/userRoutes');

//declare to make one to many relations / associations
const Department = require('./models/departmentModel');
const DepartmentLink = require('./models/departmentLinkModel');

DepartmentLink.belongsTo(Department, {
  constraints: true,
  onDelete: 'CASCADE'
  // , foreignKey: 'departmentId'
});
Department.hasMany(
  DepartmentLink
  // , { foreignKey: 'id' }
);

const app = express();
app.use(cors());

// 1) MIDDLEWARES
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/public', express.static('public')); // public files like: http://localhost:5000/public/img1.svg
app.use('/api/links', linkRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/departmentLinks', departmentLinkRouter);
app.use('/api/shobDevelopments', shobDevelopmentRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
