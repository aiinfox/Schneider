// Define the `conext_gateway` module
var conext_gateway =  angular.module('conext_gateway', ['ui.bootstrap', 'ui.utils.masks', 'ngMaterial', 'ngMessages', 'ui.router', 'ngSanitize', 'md-steppers']);

conext_gateway.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('network', {
      url: '/network',
      templateUrl: 'pages/network/network.html',
      controller: 'networkController'
    });
    
    $stateProvider
    .state('setup', {
      url: '/setup',
      templateUrl: 'pages/setup/setup.html',
      controller: 'setupController'
    });
    
    $stateProvider
    .state('devices', {
      url: '/devices',
      templateUrl: 'pages/devices/device-overview.html',
      controller: 'xbdevlistController'
    });

  $urlRouterProvider.otherwise('network');

});