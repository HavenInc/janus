angular
  .module('app')
  .controller('VoyageSelectionController', ['$scope', '$state', 'Voyage', function($scope,
      $state, Voyage) {

    $scope.voyages = [];
    function getVoyages() {
      Voyage
        .find()
        .$promise
        .then(function(results) {
          $scope.voyages = results;
        });
    }
    getVoyages();

    $scope.addTodo = function() {

    };

    $scope.removeTodo = function(item) {

    };

    reloadData();
  }]);
