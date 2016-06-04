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

    var emailOptions = {
        destiny: user.email,
        subject: "Confirm your email",
        html: process.env.CONFIRM_EMAIL_URL + user.tokenValidation
    }
    saveUser(user, emailOptions, res);


};

//Update user
module.exports.updateRegister = function (req, res) {
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

    user.save()
        .then(function (user) {
            sendJSONresponse(res, 200, {
                "message": "User Update!"
            });
        })
        .then(undefined, function (err) {
            sendJSONresponse(res, 404, {
                "error": "A error occurred, please try again later"
            });
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


//send new email with token
module.exports.newTokenValidation = function (req, res) {
    var userEmail = req.params.email;

    User
        .findOne({ email: userEmail }).exec()
        .then(function (user) {
            user.tokenValidation = user.generateTokenValidation();
            var emailOptions = {
                destiny: user.email,
                subject: "Confirm your email",
                html: process.env.CONFIRM_EMAIL_URL + user.tokenValidation
            }
            saveUser(user, emailOptions, res);

        })
        .then(undefined, function (err) {
            sendJSONresponse(res, 404, {
                "message": "user not found"
            });
            return;
        })
        .catch(console.log)
        .done();
};

//find user by id
module.exports.account = function (req, res) {
    var id = req.params.id;
    User
        .findOne({ _id: id }).exec()
        .then(function (user) {
            if (!user) {
                sendJSONresponse(res, 200, {
                    "message": "User not found"
                });
            } else {
                sendJSONresponse(res, 200, {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                });
            }
        })
        .then(undefined, function (err) {
            console.log(err);
            sendJSONresponse(res, 404, {
                "message": "A error occurred, please try again later"
            });
        });
}

//// functions ////


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

function sendEmail(emailOptions, res) {
    mailer().sendEmail(emailOptions, function (err) {
        if (err) {
            sendJSONresponse(res, 404, {
                "error": "A error occurred, please try again later"
            });
        } else {
            sendJSONresponse(res, 200, {
                "success": "a new email was sent to you, please check your mail box"
            });
        }
    });
}

function saveUser(user, emailOptions, res) {
    user.save()
        .then(function (user) {
            sendEmail(emailOptions, res);
        })
        .then(undefined, function (err) {
            sendJSONresponse(res, 404, {
                "error": "A error occurred, please try again later"
            });
        });
}