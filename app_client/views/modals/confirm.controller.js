(function () {
    angular.module('billApp').controller('confirmCtrl', confirmCtrl);

    confirmCtrl.$inject = ['$modalInstance', 'billData', 'billDataForm', '$log',];

    function confirmCtrl($modalInstance, billData, billDataForm, $log) {

        var vm = this;
        vm.data = billDataForm;


        //modal functions
        vm.modal = {
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            delete: function (id) {
                billData.billDelete(id)
                    .success(function (data) {
                        vm.modal.close(data);
                    })
                    .error(function (err) {
                        vm.formError = "Error on delete";
                    });
                return false;
            }
        };
    }
})();