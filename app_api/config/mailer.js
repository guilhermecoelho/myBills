var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var user = mongoose.model('User');

module.exports = function (token, email, name, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: '00'//process.env.EMAIL_PASS
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
                callback(err);
            } else {
                console.log("sent: " + info.response);
                callback();
            }
        }, process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0');

        
    };

    return {
        sendEmailConfirmUser: sendEmailConfirmUser
    }
};
