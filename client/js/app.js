// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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
