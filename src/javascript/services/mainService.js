(function () {
  'use strict';
  angular.module('App')
  .factory('mainService', mainService);

  function mainService($http, $q) {

    // Setting the up the factory to handle the request/response

    var o = {};
    o.getData = getData;
    o.main_data = {};
    return o;

    // Request handling function and sets the response on the factory to be used on the main controller

    function getData(data) {
      var q = $q.defer();
      $http.post('/data', data).success(function(res) {
        o.main_data = res;
        q.resolve(res);
      });
      return q.promise;
    }
  }
})();
