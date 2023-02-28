const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
	// Create Email Transporter
	let transporter = await nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'mjdavda02@gmail.com',
			pass: 'tupggkdqefmllkyy',
		},
	});

	// Option for sending email
	const options = {
		from: 'mjdavda02@gmail.com',
		to: 'mayurschittaragi@gmail.com, mjdavda@hotmail.com',
		replyTo: reply_to,
		subject: subject,
		html: message,
	};

	// send email
	transporter.sendMail(options, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
};

module.exports = sendEmail;
