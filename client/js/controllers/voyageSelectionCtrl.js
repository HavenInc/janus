angular
  .module('app')
  .controller('VoyageSelectionController', ['$scope', '$state', 'PortCall', function($scope,
      $state, PortCall) {

    $scope.voyages = [];

    $scope.dateOptions = {
      initDate: new Date(2016, 00, 01),
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.displayRoutes = function(departureDate, arrivalDate) {
      var params = {
        departureDate: departureDate,
        arrivalDate: arrivalDate
      };

      PortCall
        .getRoutes(params)
        .$promise
        .then(function(results) {
          $scope.voyages = results;
        });
    };

    $scope.departureDateCal = {
      opened: false
    };

    $scope.arrivalDateCal = {
      opened: false
    };

    $scope.openDepartureDate = function() {
      $scope.departureDateCal.opened = true;
    }

    $scope.openArrivalDate = function() {
      $scope.arrivalDateCal.opened = true;
    }


  }]);
