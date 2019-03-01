var home = angular.module('home', [
    'ngRoute',
    'api.establishment',
    'api.sirene',
    'api.rna',
    'api.asyncCalls',
    'api.string',
    'api.establishmentsFiltering'
])

    .config(['$routeProvider',
        function ($routeProvider)
        {
            'use strict';
            $routeProvider.
                when('/', {
                    templateUrl: 'js/modules/index/views/index.html',
                    controller: 'IndexCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
    ]);