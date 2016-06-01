(function () {
    angular.module('billApp').controller('billDetailsModalCtrl', billDetailsModalCtrl);

    billDetailsModalCtrl.$inject = ['$modalInstance', 'billData', 'billDataForm', '$log', '$routeParams'];

    function billDetailsModalCtrl($modalInstance, billData, billDataForm, $log, $routeParams) {

        var vm = this;
        vm.formData = billDataForm;

        //submit form
        vm.onSubmit = function () {

            vm.formError = "";
            var isUpdate = vm.formData.id == null ? false : true;
            if (!vm.formData.name || !vm.formData.payday) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.formData.autopay = vm.formData.autopay == null ? false : true;

                if (isUpdate) {
                    vm.billUpdate(vm.formData.id, vm.formData);
                } else {
                    vm.billCreate(vm.formData);
                }
            }
        };

        // update bills
        vm.billUpdate = function (id, data) {

            billData.billUpdate(id, {
                name: data.name,
                payday: data.payday,
                autopay: data.autopay
            })
                .success(function (data) {
                    vm.modal.close(data);
                })
                .error(function (err) {
                    vm.formError = "Error on update";
                });
            return false;
        };

        //create bills
        vm.billCreate = function (data) {

            billData.billCreate({
                name: data.name,
                payday: data.payday,
                autopay: data.autopay
            })
                .success(function (data) {
                    vm.modal.close(data);
                })
                .error(function (err) {
                    vm.formError = "Error on create";
                });
            return false;
        };

        //modal functions
        vm.modal = {
            close: function (result) {
                $modalInstance.close(result);
            },
            cancel: function () {
                $modalInstance.dismiss('cancel');
            }
        };
    }
})();