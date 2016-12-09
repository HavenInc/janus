angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ui.bootstrap'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('voyageSelection', {
        url: '',
        templateUrl: 'views/voyageSelection.html',
        controller: 'VoyageSelectionController'
      });

    $urlRouterProvider.otherwise('voyageSelection');
  }]);
