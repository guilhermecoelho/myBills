var mongoose = require('mongoose');
var bill = mongoose.model('Bill');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.billList = function (req, res) {
    getAuthor(req, res, function (req, res, userName) {
        bill
            .find()
            .exec(function (err, value) {

                if (!value) {
                    sendJsonResponse(res, 404, {
                        "message": "no bills found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                } else {
                    if (value.length == 0) {
                        sendJsonResponse(res, 200, {
                            "message": "no bills found"
                        });
                    } else {
                        sendJsonResponse(res, 200, value);
                    }

                }
            });
    });

};

module.exports.billFindOne = function (req, res) {
    bill
        .findById(req.params.billId)
        .exec(function (err, value) {
            if (!value) {
                sendJsonResponse(res, 404, {
                    "message": "no bills found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            } else {
                sendJsonResponse(res, 200, value);
            }
        });
};

module.exports.billCreate = function (req, res) {
    bill.create({
        name: req.body.name,
        payday: req.body.payday,
        payed: false,
        autopay: req.body.autopay
    }, function (err, value) {
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            sendJsonResponse(res, 201, value);
        }
    });
};

module.exports.billUpdate = function (req, res) {
    bill
        .findById(req.params.billId)
        .exec(function (err, value) {
            if (!value) {
                sendJsonResponse(res, 404, {
                    "message": "no bills found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            } else {

                value.name = req.body.name == null ? value.name : req.body.name;
                value.payday = req.body.payday == null ? value.payday : req.body.payday;
                value.payed = req.body.payed == null ? value.payed : req.body.payed;
                value.autopay = req.body.autopay == null ? value.autopay : req.body.autopay;

                value.save(function (err, value) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, value);
                    }
                });
            }
        });
};
module.exports.billDelete = function (req, res) {
    bill
        .findByIdAndRemove(req.params.billId)
        .exec(function (err, value) {
            if (!value) {
                sendJsonResponse(res, 404, {
                    "message": "no bills found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            } else {
                sendJsonResponse(res, 204, { "message": "bill deleted" });
            }
        });
};

//get the user 
var getAuthor = function (req, res, callback) {
    //console.log(req.payload)
    if (req.payload && req.payload.email) {
        User
            .findOne({ email: req.payload.email })
            .exec(function (err, user) {
                if (!user) {
                    sendJsonResponse(res, 404, {
                        "message": "user not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                callback(req, res, user.email);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "user not found"
        });
        return;
    }
};