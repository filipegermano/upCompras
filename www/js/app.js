// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.factory('Auth', function($firebaseAuth) {
    var endPoint = "https://upcompras.firebaseio.com/users";
    var usersRef = new Firebase(endPoint);

    return $firebaseAuth(usersRef);

})

.controller('Controller', function($scope, Auth, $cordovaBarcodeScanner, $http) {

    Auth.$onAuth(function (authData) {
        if (authData === null) {
            console.log('Usuário não autenticado');
        } else {
            console.log('Usuário logado');
            console.log(authData);
        }

        $scope.authData = authData;
    });

    $scope.login = function (authMethod) {
        Auth.$authWithOAuthRedirect(authMethod).then(function(authData){
            console.log("face", authData);
        }).catch(function(error) {
            if (error.code === 'TRANSPORT_UNAVAILABLE') {
                Auth.$authWithOAuthPopup(authMethod).then(function (authData) {});
            } else {
                console.log(error);
            }
        })
    };

    $scope.ler = function () {

        $cordovaBarcodeScanner.scan().then(function (imagemEscaneada) {
            $http.get("https://upcompras.herokuapp.com/produto/"+imagemEscaneada.text, {}).then(function (response) {

                alert(response.data.descricao + " - " + response.data.embalagem);
            }, function () {
                alert('Algum erro ocorreu: ');
            })

        }, function (error) {
            alert('Algum erro ocorreu: ', error);
        });
    }


})
