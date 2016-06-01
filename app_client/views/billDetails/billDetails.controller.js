(function () {
    angular.module('billApp').controller('billDetailsCtrl', billDetailsCtrl);

    billDetailsCtrl.$inject = ['$routeParams', '$modal', 'billData'];

    function billDetailsCtrl($routeParams, $modal, billData) {
        var vm = this;

        vm.billId = $routeParams.billId;

        billData.billById(vm.billId)
            .success(function (data) {
                vm.data = { bill: data };
                vm.pageHeader = {
                    title: vm.data.bill.name
                };
            })
            .error(function (e) {
                console.log(e);
            });

        vm.popupEditForm = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/billDetailsModal/billDetailsModal.view.html',
                controller: 'billDetailsModalCtrl as vm',
                resolve: function () {
                    return {
                        billId: vm.billId,
                        billName: vm.data.bill.name,
                        billPayday: vm.data.bill.payday
                    }
                }
            });
        }
    }
})();