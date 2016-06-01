var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var user = mongoose.model('User');

module.exports = function (token, email, name, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'guilhermecoelho2@gmail.com',
            pass: 'c0elh1to01*'
        }
    });

    var mailOptions = function (subject, html) {
        return {
            from: 'Guilherme Teste <guilhermecoelho2@gmail.com>',
            to: 'guilhermecoelho2@gmail.com',
            subject: subject,
            html: html
        }
    };
    var sendEmailConfirmUser = function (token, email, name, callback) {
        var subject = "Confirm your email";
        var to = email;
        var authenticationURL = 'http://localhost:3000/#/confirmEmail/' + token;
        var text = "Confirm your email clicking on link " + authenticationURL;

        transporter.sendMail(mailOptions(subject, text, to), function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log("sent: " + info.response);
            }
        }, process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0');

        callback();
    };

    return {
        sendEmailConfirmUser: sendEmailConfirmUser
    }
};
