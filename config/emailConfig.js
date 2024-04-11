const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

// Using brevo smtp server
// Making transporter using node mailer to send emails
let brevo_email_transporter = nodemailer.createTransport({
	host: process.env.BREVO_EMAIL_HOST,
	port: process.env.BREVO_EMAIL_PORT,
	auth: {
		user: process.env.BREVO_EMAIL_USER,
		pass: process.env.BREVO_EMAIL_PASS,
	},
	tls: {
		rejectUnAuthorized: true
	}
});



// Using gmail smtp server
// Making transporter using node mailer to send emails
let transporter = nodemailer.createTransport({
	service: "gmail",
	host: process.env.GMAIL_SMTP_EMAIL_HOST,
	port: process.env.GMAIL_SMTP_EMAIL_PORT,
	secure: true,
	secureConnection: false,
	auth: {
		user: process.env.GMAIL_SMTP_EMAIL_USER,
		pass: process.env.GMAIL_SMTP_EMAIL_PASS,
	},
	tls: {
		rejectUnAuthorized: true
	}
});

module.exports = {
  brevo_email_transporter,
  transporter
};