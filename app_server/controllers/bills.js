var request = require('request');

module.exports.index = function (req, res) {
  res.render('index', {
    title: 'Bills',
    pageHeader: {
      title: 'testing the bill',
      strapline: 'this is a subtitle'
    }
  })
};

module.exports.billAdd = function (req, res) {
  res.render('index', { title: ' Add bill' })
};
