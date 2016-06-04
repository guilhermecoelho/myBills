(function () {

    angular
        .module('billApp')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$location', 'authentication', '$routeParams'];
    
    function accountCtrl($location, authentication, $routeParams) {
        var vm = this;

        var id = $routeParams.id;

        vm.pageHeader = {
            title: 'Your account'
        };

        vm.credentials = {
            id:"",
            email: "",
            name: "",
            password: ""
        };
        
        authentication.account(id)
            .success(function (data) {
                vm.credentials = {
                    id : data._id,
                    email: data.email,
                    name: data.name,
                    password : "",
                    isUpdate: true
                };
            })
            .error(function (e) {
                console.log(e);
            });


        vm.returnPage = $location.search().page || '/';

        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.credentials.email || !vm.credentials.name || !vm.credentials.password) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.Update();
            }
        };

        vm.Update = function () {
            vm.formError = "";
            authentication
                .updateRegister(vm.credentials)
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