angular.module('showroomModule')
  .controller('modelController', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {
    const SERVER = 'https://proiect-alexb2806.c9users.io'

    let $constructor = () => {
      $http.get(SERVER + '/companies/' + $stateParams.id)
        .then((response) => {
          $scope.company = response.data
          return $http.get(SERVER + '/companies/' + $stateParams.id + '/models')
        })
        .then((response) => {
          $scope.models = response.data
        })
        .catch((error) => console.warn(error))
    }

    $scope.addModel = (model) => {
      $http.post(SERVER + '/companies/' + $stateParams.id + '/models', model)
        .then((response) => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }

    $scope.deleteModel = (model) => {
      $http.delete(SERVER + '/companies/' + $stateParams.id + '/models/' + model.id)
        .then((response) => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }

    $scope.selected = {}

    $scope.getTemplate = (model) => {
      if (model.id == $scope.selected.id) {
        return 'edit'
      }
      return 'display'
    }

    $scope.editModel = (model) => {
      $scope.selected = model
    }

    $scope.cancelEditing = (model) => {
      $scope.selected = {}
    }

    $scope.saveModel = (model) => {
      $http.put(SERVER + '/companies/' + $stateParams.id + '/models/' + model.id, model)
        .then(() => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }

    $constructor()
  }])
