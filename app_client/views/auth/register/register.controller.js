(function () {

    angular
        .module('billApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$location', 'authentication'];
    function registerCtrl($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: 'Create a new account'
        };

        vm.credentials = {
            email: "",
            name: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/';

        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.credentials.email || !vm.credentials.name || !vm.credentials.password) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doRegister();
            }
        };

        vm.doRegister = function () {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .error(function (err) {
                    vm.formError = err.message;
                })
                .then(function () {
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
        };

    }

})();