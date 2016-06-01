var mongoose = require('mongoose');
var gracefulShutdown;
require('./bills');
require('./users');

var url = process.env.BASE_URL;

//log database
// var urlLog = 'mongodb://localhost/testelog';
// var logDb = mongoose.createConnection(urlLog);

mongoose.connect(url);


mongoose.connection.on('connected', function () {
    console.log('mongoose connected to: ' + url);
});

mongoose.connection.on('error', function (err) {
    console.log('mongoose connected error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('mongoose disconnected');
});

//disconnect mongoose
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('mongoose disconnected throuth' + msg);
    });
};

//restart in nodemon
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//finish application
process.once('SIGINT', function () {
    gracefulShutdown('app finish', function () {
        process.kill(process.pid, 'SIGINT');
    });
});


//log connection
// logDb.on('connected', function () {
//     console.log('mongoose connected to ' + urlLog);
// });

// logDb.close(function () {
//     console.log('mongoose log disconnected');
// });

