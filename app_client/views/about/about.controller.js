(function () {
    angular
        .module('billApp')
        .controller('aboutCtrl', aboutCtrl);

    function aboutCtrl() {
        var vm = this;
        
        vm.pageHeader = {
            title :  'About bills'
        };
        vm.main = {
            content: 'testing another page \n and again'
        };
    }
})();

