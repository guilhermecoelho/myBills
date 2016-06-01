(function () {
    angular
        .module('billApp')
        .filter('addHtmlLineBreaks', addHtmlLineBreaks);

    function addHtmlLineBreaks() {
        return function(text){
            return text.replace(/\n/g, '<br />');
        }
    }
})();