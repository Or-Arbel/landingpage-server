const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = (email, link) => {
  const mailOptions = {
    from: 'do not reply',
    to: email, // בהמשך אשנה את זה שהמייל יישלח ללקוח ולא אליי
    subject: 'מייל איפוס סיסמא - נשלח מדף הנחיתה של פורטל שועל',
    text: `על מנת לאפס סיסמא נא היכנס ללינק: ${link}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Avichai Iluz <hello@avichai.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     // html:
//   };

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
