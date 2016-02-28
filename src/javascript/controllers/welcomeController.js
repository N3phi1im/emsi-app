(function() {
  'use strict';
  angular.module('App')
    .controller('welcomeController', welcomeController);

  function welcomeController(mainService, $state) {
    var vm = this;
    vm.data = mainService.data;
    vm.getData = function() {
      mainService.getData(vm.requested_data).then(function(res) {
        $state.go("Main");
      });
    };
  }
})();
