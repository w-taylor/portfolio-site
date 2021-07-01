function sendMail(fromName, fromAddress, mesSubject, message) {

	require('dotenv').config();

	let nodemailer = require('nodemailer');

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
			clientId: process.env.OAUTH_CLIENTID,
			clientSecret: process.env.OAUTH_CLIENT_SECRET,
			refreshToken: process.env.OAUTH_REFRESH_TOKEN
		}
	});

	message = message + "\n\n\n email sent from " + fromName + " at " + fromAddress;

	let mailOptions = {
		from: fromAddress,
		to: process.env.MAIL_USERNAME,
		subject: mesSubject,
		text: message
	};

	transporter.sendMail(mailOptions, function(err, data) {
		if (err) {
			console.log("Error sending mail: " + err);
		} else {
			console.log("Email sent successfully");
		}
	});
};


module.exports = { sendMail };
