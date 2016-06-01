(function () {
    angular
        .module('billApp')
        .directive('navegation', navegation);

    function navegation() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/navegation/navegation.template.html',
            controller: 'navigationCtrl as navvm'
        };
    }
})();