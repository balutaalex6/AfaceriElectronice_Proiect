'use strict'
let app = angular.module('ShowroomApp', [
    'ui.router',
    'showroomModule'
])




app
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/companies')
        $stateProvider
            .state('welcome', {
                url : '/welcome',
                templateUrl : 'views/welcome.html'
            })
            .state('company', {
                url : '/companies',
                templateUrl : 'views/company.html',
                controller : 'companyController'
            })
            .state('model', {
                url : '/companies/:id',
                templateUrl : 'views/model.html',
                controller : 'modelController'
            })
    }])
    .directive('validMessage', function(){
        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(s, e, a, c){
                c.$validators.validMessage = function(value) {
                    if (value){
                        return value.startsWith('a')    
                    }
                    else{
                        return false
                    }
                }
            }
        }
    })
