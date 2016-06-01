(function () {
    angular.module('billApp').controller('alertCtrl', alertCtrl);

    alertCtrl.$inject = ['$modalInstance', 'data'];

    function alertCtrl($modalInstance, data) {
        var vm = this;
        vm.message = data.message;
        
        vm.modal = {
            close: function () {
                $modalInstance.dismiss('cancel');
            }
        };
    }
})();