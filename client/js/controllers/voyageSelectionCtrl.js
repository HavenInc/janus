angular
  .module('app')
  .controller('VoyageSelectionController', ['$scope', '$state', 'Voyage', function($scope,
      $state, Voyage) {

    $scope.voyages = [];
    $scope.departurePort = "HKHKG";
    $scope.arrivalPort = "SGSIN";

    function getVoyages() {
      Voyage
        .find()
        .$promise
        .then(function(results) {
          $scope.voyages = results;
        });
    }
    getVoyages();

    $scope.displayRoutes = function(departurePort, arrivalPort) {
      var params = {
        departurePort: departurePort,
        arrivalPort: arrivalPort
      };
      console.log(params);

      Voyage
        .getRoutes(params)
        .$promise
        .then(function(results) {
          $scope.routes = results;
          alert($scope.routes);
        });
    };
  }]);
