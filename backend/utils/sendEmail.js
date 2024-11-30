const nodemailer = require('nodemailer');
var dotenv = require('dotenv');

var env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });
// Configure Nodemailer
console.log(process.env.EMAIL_PASS)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// Send login email
const sendLoginEmail=(email, token)=> {
    const loginLink = `${process.env.FRONTEND_URL}/loginByLink/${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Login Link',
        text: `Click on this link to log into the system: ${loginLink}. This link expires in 1 minute.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}
  module.exports=sendLoginEmail