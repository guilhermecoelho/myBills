(function () {
    angular.module('billApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/bills/:billId', {
                templateUrl: '/views/billDetails/billDetails.view.html',
                controller: 'billDetailsCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/views/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/views/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/confirmEmail/:token', {
                templateUrl: '/views/auth/confirmEmail/confirmEmail.view.html',
                controller: 'confirmEmailCtrl',
                controllerAs: 'vm'
            })
            .when('/notValidated/:email', {
                templateUrl: '/views/auth/notValidated/notValidated.view.html',
                controller: 'notValidatedCtrl',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enable: true,
            requireBase: false
        });
    }
    angular
        .module('billApp')
        .config(['$routeProvider', '$locationProvider', config]);
})(); 