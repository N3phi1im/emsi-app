(function() {
  'use strict';
  angular.module('App')
    .controller('welcomeController', welcomeController);

  function welcomeController(mainService, $state) {

    // Global Variables

    var vm = this;
    vm.data = mainService.data;

    // Main request from welcome page to setup displaying the JSON response

    vm.getData = function() {
      mainService.getData(vm.requested_data).then(function(res) {
        $state.go("Main");
      });
    };
  }
})();
