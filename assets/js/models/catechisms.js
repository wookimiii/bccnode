angular.module('catechisms', ['ngResource']).
    factory('Catechism', function($resource) {
      var Catechism = $resource('/api/catechisms/:id', 
        {
          format: 'json'
        },
        {
          update: { method: 'PUT' }
        }
      );
      return Catechism;
    });


