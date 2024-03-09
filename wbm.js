var nodemailer = require('nodemailer');
const cron = require('node-cron');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajjainn1akky@gmail.com',
    pass: 'sjbr gxgt uofg sraf'
  }
});

var mailOptions = {
  from: 'rajjainn1akky@gmail.com',
  to: 'rajatkumar5238@gmail.com',
  subject: 'Test Subject',
  text: 'That was easy!'
};



function logMessage() {
  console.log('Cron job executed at:', new Date().toLocaleString());
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}



cron.schedule('* * * * *', () => {
  logMessage();
});
