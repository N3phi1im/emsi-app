(function () {
  'use strict';
  angular.module('App')
  .factory('mainService', mainService);

  function mainService($http, $q) {
    var o = {};
    o.getData = getData;
    o.main_data = {};
    console.log('loading service');
    return o;

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
