app = angular.module('starter', ['ui.router','config','ui.bootstrap']).
    config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('authInterceptor');

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('doctors-list', {
            url: '/',
            controller: 'ListCtrl',
            templateUrl: 'templates/list.html'
        })

        .state('doctor-detail', {
            url: '/detail/:_id',
            controller: 'DetailCtrl',
            templateUrl: 'templates/detail.html'
        });

});