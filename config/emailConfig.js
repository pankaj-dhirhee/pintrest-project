const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

// Making transporter using node mailer to send emails
let transporter = nodemailer.createTransport({
	service: "gmail",
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: true,
	secureConnection: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	tls: {
		rejectUnAuthorized: true
	}
});

module.exports = transporter;