var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var user = mongoose.model('User');

module.exports = function (token, email, name, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = function (options) {
        return {
            from: process.env.EMAIL_FROM,
            to: options.destiny,
            subject: options.subject,
            html: options.html
        }
    };
   
    var sendEmail = function (options, callback) {
        transporter.sendMail(mailOptions(options), function (err, info) {
            if (err) {
                callback(err);
            } else {
                console.log("sent: " + info.response);
                callback();
            }
        }, process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0');
    };

    return {
        sendEmail: sendEmail
    }
};
