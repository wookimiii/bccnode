var app = angular.module('app', ['catechisms']);

function ListCtrl($scope, Catechism){
  $scope.catechisms = Catechism.query();
  
  $scope.debug = function(){
    console.log($scope.catechisms);
  }

}
