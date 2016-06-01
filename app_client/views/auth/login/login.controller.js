(function () {

  angular
    .module('billApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', '$modal', 'authentication'];
  function loginCtrl($location, $modal, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in'
    };

    vm.credentials = {
      email: "",
      name: "",
      password: ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doLogin();
      }
    };

    vm.doLogin = function () {
      vm.formError = "";
      authentication
        .login(vm.credentials)
        .error(function (err) {
          if (err.message == "User not validated") {
            console.log(vm.credentials.email);
            vm.notValidated = vm.credentials.email;
          }
          vm.formError = err.message;
        })
        .then(function () {
          $location.search('page', null);
          $location.path(vm.returnPage);
        });
    };

    vm.newTokenValidation = function (email) {
      authentication.newTokenValidation(email)
      .success(function(data){
        vm.popupConfirmSendEmail(true);
      })
      .error(function(err){
        vm.popupConfirmSendEmail(false);
      })
    };

    //open modal 
    vm.popupConfirmSendEmail = function (isOk) {

      var msg = isOk == true ? "Email send successly" : "Erro to send email";
      
      var modalInstance = $modal.open({
        templateUrl: 'views/modals/alert/alert.view.html',
        controller: 'alertCtrl as vm',
        resolve: {
          data: function () {
            return {
              message: msg
            }
          }
        }
      });
    };
  }

})();