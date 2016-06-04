(function () {
    angular.module('billApp').service('authentication', authentication);

    authentication.$inject = ['$window', '$http'];

    function authentication($window, $http, $location) {
        var saveToken = function (token) {
            $window.localStorage['billApp-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['billApp-token'];
        };

        var isLoggedIn = function () {
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return {
                    name: payload.name,
                    id: payload._id
                };
            }
        };

        register = function (user) {
            return $http.post('/api/register', user)
                .success(function (data) {
                    saveToken(data.token);
                });
        };

        updateRegister = function (user) {
            return $http.put('/api/updateRegister', user, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            });
        };

        login = function (user) {
            return $http.post('/api/login', user)
                .success(function (data) {
                    saveToken(data.token);
                });
        };

        confirmEmail = function (validationToken) {
            return $http.get('/api/confirmemail/' + validationToken)
                .success(function (data) {
                    saveToken(data.token);
                });
        };

        newTokenValidation = function (email) {
            return $http.get('/api/newTokenValidation/' + email)
                .success(function (data) {
                    //saveToken(data.token);
                });
        };

        logout = function () {
            $window.localStorage.removeItem('billApp-token');
        }

        account = function (id) {
            return $http.get('/api/account/' + id, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            })
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            register: register,
            updateRegister: updateRegister,
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            confirmEmail: confirmEmail,
            newTokenValidation: newTokenValidation,
            account: account
        };
    }
})(); 