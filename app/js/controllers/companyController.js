'use strict'
let ctrl = angular.module('showroomModule', ['ui.router'])

const SERVER = 'https://proiect-alexb2806.c9users.io'

ctrl.controller('companyController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    var id;

    let $constructor = () => {
        $http.get(SERVER + '/companies')
            .then((response) => {
                $scope.companies = response.data
            })
            .catch((error) => console.log(error))
    }

    $scope.addCompany = (company) => {
        $http.post(SERVER + '/companies', company)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $scope.deleteCompany = (company) => {
        $http.delete(SERVER + '/companies/' + company.id)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $scope.selected = {}
    $scope.restoreCopy = {}

    $scope.getTemplate = (company) => {
        if (company.id == $scope.selected.id) {
            return 'edit'
        }
        return 'display'
    }

    $scope.editCompany = (company) => {
        $scope.selected = company
        $scope.restoreCopy = angular.copy(company)
    }

    $scope.cancelEditing = (company) => {
        $scope.selected = {}
        company = angular.copy($scope.restoreCopy)
    }

    $scope.saveCompany = (company) => {
        $http.get(SERVER + '/companies/' + company.id, company)
            .then(() => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $scope.companyDetails=(company)=>{
        
        $http.get(SERVER+'/companies/'+company.id+'/models').then(() => {
                $state.go('model', {id:company.id}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }
    
    
    $constructor()
}])
