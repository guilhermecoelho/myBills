(function () {
    angular.module('billApp').controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['billData', '$modal', '$log', 'authentication', '$location'];

    function homeCtrl(billData, $modal, $log, authentication, $location) {


        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();
        //only open the page if user is logged
        if (vm.isLoggedIn) {
            vm.pageHeader = {
                title: 'my Bills'
            };
            vm.message = 'my bills';

            reload();

            //open modal to update
            vm.popupEditForm = function (bill) {

                vm.data = bill;
                var isUpdate = vm.data.id == "" ? false : true;

                var modalInstance = $modal.open({
                    templateUrl: 'views/billDetailsModal/billDetailsModal.view.html',
                    controller: 'billDetailsModalCtrl as vm',
                    resolve: {
                        billDataForm: function () {
                            reload();
                            return {
                                id: vm.data._id,
                                name: vm.data.name,
                                payday: vm.data.payday,
                                autopay: vm.data.autopay,
                                payed: vm.data.payday
                            }
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    if (!isUpdate) {
                        vm.data.bills.push(data);
                    } else {
                        reload();
                    }
                });
            };

            //open modal to create
            vm.popupNewForm = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'views/billDetailsModal/billDetailsModal.view.html',
                    controller: 'billDetailsModalCtrl as vm',
                    resolve: {
                        billDataForm: function () {
                            reload();
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    vm.data.bills.push(data);
                });
            };

            vm.showError = function (error) {
                $scope.$apply(function () {
                    vm.message = error.message;
                });
            };

            //open modal to delete
            vm.popupDelete = function (bill) {
                vm.data = bill;

                var modalInstance = $modal.open({
                    templateUrl: 'views/modals/confirm.view.html',
                    controller: 'confirmCtrl as vm',
                    resolve: {
                        billDataForm: function () {
                            reload();
                            return {
                                id: vm.data._id
                            }
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    reload();
                });
            };

            vm.showError = function (error) {
                $scope.$apply(function () {
                    vm.message = error.message;
                });
            };

            //load list 
            function reload() {
                billData.billList()
                    .success(function (data) {
                        vm.message = data.length > 0 ? "" : "No bills found";
                        vm.data = { bills: data };

                    })
                    .error(function (e) {
                        vm.message = "Sorry, something's gone wrong";
                    });
            }

            //change payed on click 
            vm.changePay = function (data) {
                
                billData.billUpdate(data._id, {
                    name: data.name,
                    payday: data.payday,
                    autopay: data.autopay,
                    payed: !data.payed
                })
                    .success(function (data) {
                        reload();
                    })
                    .error(function (err) {
                        vm.formError = "Error on update";
                    });
                return false;
            };


        } else {
            $location.path('/login');
        }
    }

})();