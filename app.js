const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const linkRouter = require('./routes/linkRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const departmentLinkRouter = require('./routes/departmentLinkRoutes');
const shobDevelopmentRouter = require('./routes/shobDevelopmentRoutes');
const mainLinkRouter = require('./routes/mainLinkRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const reportUrlRouter = require('./routes/reportUrlRoutes');
const selaLinkRouter = require('./routes/selaLinkRoutes');

const userRouter = require('./routes/userRoutes');

//declare to make one to many relations / associations
const Department = require('./models/departmentModel');
const DepartmentLink = require('./models/departmentLinkModel');

DepartmentLink.belongsTo(Department, {
  constraints: true,
  onDelete: 'CASCADE'
});
Department.hasMany(DepartmentLink);

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
app.use('/api/mainLinks', mainLinkRouter);
app.use('/api/reportUrl', reportUrlRouter);
app.use('/api/sela', selaLinkRouter);

//reset pass - will not work in the orange network
// app.get(`/reset-password/:id/:token`, (req, res, next) => {
//   res.send(req.params);
// });

//route for signup, getAllUsers...
app.use('/api/users', userRouter);

app.use('/uploads', express.static('uploads'));
app.use('/api/upload', imageUploadRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
