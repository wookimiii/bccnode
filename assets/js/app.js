var app = angular.module('app', ['catechisms']);
app.config(function($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider.
    when('/new', {controller:NewCtrl, template:$('#new').html()}).
    otherwise({controller:ListCtrl, template:$('#list').html()});
  });

function MainCtrl($scope, Catechism, $location){
  $scope.fetchData = function(){
    $scope.catechisms = Catechism.query();
  }
  $scope.fetchData();

  $scope.goHome = function(){
    $location.path("");
  }
}

function ListCtrl($scope, Catechism){
  
  $scope.debug = function(){
    console.log($scope.catechisms);
  }

}

function NewCtrl($scope, Catechism){
  $scope.new = {
    number: 3,
    question: "What do the Scriptures principally teach?",
    answer: "The Scriptures principally teach, what man is to believe concerning God, and what duty God requires of man."
  }

  $scope.verses = "Genesis 1:1;John 5:39";

  $scope.save = function(){
    console.log($scope.new.verses);
    var catechism = new Catechism($scope.new);
    console.log(catechism);
    catechism.$save(function(){
      $scope.fetchData();
      $scope.goHome();
    });
  }

  $scope.parseVerses = function(){
    $scope.new.verses = $scope.verses.split(";");
  }

  $scope.$watch('verses', $scope.parseVerses);
}
