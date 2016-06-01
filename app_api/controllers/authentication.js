var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var mailer = require('../config/mailer');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

//create new user
module.exports.register = function (req, res) {
    if (!req.body.email || !req.body.name || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }

    var user = new User();

    user.email = req.body.email;
    user.name = req.body.name;
    user.setPassword(req.body.password);
    user.isValidated = false;

    user.tokenValidation = user.generateTokenValidation();

    user.save(function (err) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            //token = user.generateJwt();
            mailer().sendEmailConfirmUser(user.tokenValidation, user.email, user.name, function () {
                sendJSONresponse(res, 200, {
                    "success": "We sent a confirmation email to you, please check your email box to continue the register"
                });
            });
        }
    });
};

//validate login and send token
module.exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    passport.authenticate('local', function (err, user, info) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};

//confirm and validate user 
module.exports.confirmEmail = function (req, res) {
    var tokenValidation = req.params.token;
    User
        .findOne({ tokenValidation: tokenValidation })
        .exec(function (err, user) {
            if (!user) {
                sendJSONresponse(res, 404, {
                    "message": "user not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            } else {
                validateUser(user, res);
            }
        });
};

module.exports.newTokenValidation = function (req, res) {
    var userEmail = req.params.email;
    User
        .findOne({ email: userEmail })
        .exec(function (err, user) {
            if (!user) {
                sendJSONresponse(res, 404, {
                    "message": "user not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 404, err);
                return;
            } else {
                user.tokenValidation = user.generateTokenValidation();
                user.save(function (err) {
                    var token;
                    if (err) {
                        sendJSONresponse(res, 404, err);
                    } else {
                        mailer().sendEmailConfirmUser(user.tokenValidation, user.email, user.name, function () {
                            sendJSONresponse(res, 200, {
                                "success": "a new email was sent to you, please check youe mail box"
                            });
                        });
                    }
                });
            }
        });
};

function validateUser(user, res) {
    user.isValidated = true;

    user.save(function (err) {
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        } else {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        }
    });

}