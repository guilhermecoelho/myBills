module.exports.index = function(req, res){
  res.render('index', {title: 'Express'})  
};

module.exports.angularApp = function(req, res){
  res.render('layout', {title: 'Bills'})  
};