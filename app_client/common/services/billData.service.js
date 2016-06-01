(function () {
    angular.module('billApp').service('billData', billData);

    billData.$inject = ['$http', 'authentication'];

    function billData($http, authentication) {
        var billList = function () {
            return $http.get('/api/bills', {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var billById = function (billId) {
            return $http.get('/api/bills/' + billId, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var billUpdate = function (billId, data) {
            return $http.put('/api/bills/' + billId, data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var billCreate = function (data) {
            return $http.post('/api/bills/', data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var billDelete = function (billId) {
            return $http.delete('/api/bills/' + billId, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        return {
            billList: billList,
            billById: billById,
            billUpdate: billUpdate,
            billCreate: billCreate,
            billDelete: billDelete
        };
    }
})(); 