var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
mongoose.set('debug', true);

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        unique: true,
        require: true
    },
    isValidated: {
        type: Boolean,
        required: true
    },
    tokenValidation: {
        type: String
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();

    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);

};

userSchema.methods.generateTokenValidation = function (email) {
    var seed = crypto.randomBytes(20);
    var authToken = crypto.createHash('sha1').update(seed + email).digest('hex');
    
    return authToken;
};

mongoose.model('User', userSchema);