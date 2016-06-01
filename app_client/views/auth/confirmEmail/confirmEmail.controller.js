(function () {

    angular
        .module('billApp')
        .controller('confirmEmailCtrl', confirmEmailCtrl);

    confirmEmailCtrl.$inject = ['$location', '$routeParams', 'authentication'];
    function confirmEmailCtrl($location, $routeParams, authentication) {
        var vm = this;

        vm.token = $routeParams.token;
        
        authentication
            .confirmEmail(vm.token)
            .success(function (data) {
                $location.search('page', null);
                $location.path('/');
            })
            .error(function (err) {
                vm.message = err.message;
            })
    }

})();