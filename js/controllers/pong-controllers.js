
var app = angular.module('app', []);
/* global base_url */
app.service('PongService', [
    '$q',
    function ($q) {
        this.getNames = function () {
            var deferred = $q.defer();
            var jugadores = [];
            jugadores.push(prompt("ingrese el nombre del jugador 1"));
            jugadores.push(prompt("ingrese el nombre del jugador 2"));
            deferred.resolve(jugadores);
            return deferred.promise;
        };
    }
]);

app.controller('PongCtrl', function ($scope, PongService,$interval) {
    $scope.last_char_code = 0;
    $scope.jugadores = [];
     PongService.getNames().then(function (data) {
      $scope.jugador1={nombre:data[0], puntuacion:0};
      $scope.jugador2={nombre:data[1],puntuacion:0};
     });
    $scope.pad1 = { posiciony: 170, posicionx: 40 };
    $scope.pad2 = { posiciony: 170, posicionx: 740 };
    $scope.ball={posicionx:0, posiciony:80, changex:10,changey:10};
    $interval(function() {
        $scope.ball.posicionx+=$scope.ball.changex;
        $scope.ball.posiciony+=$scope.ball.changey;
        if($scope.ball.posicionx>=450){
            $scope.ball.changex=-10;
        }
        if($scope.ball.posicionx<=0){
            $scope.ball.changex=10;
        }
        if($scope.ball.posiciony<=50){
            if($scope.pad1.posiciony<=$scope.ball.posicionx&&$scope.ball.posicionx<=$scope.pad1.posiciony+120){
                $scope.ball.changey=10;
            }else{
                alert("punto para el jugador 2");
                $scope.jugador2.puntuacion++;
                $scope.ball={posicionx:0, posiciony:80, changex:10,changey:10};
            }
        }
        if($scope.ball.posiciony>=700){
            if($scope.pad2.posiciony<=$scope.ball.posicionx&&$scope.ball.posicionx<=$scope.pad2.posiciony+120){
                $scope.ball.changey=-10;
            }else{
                alert("punto para el jugador 1");
                $scope.jugador1.puntuacion++;
                $scope.ball={posicionx:0, posiciony:80, changex:10,changey:10};
            }
        }
      }, 100);
    $scope.movePad1 = function (e) {
        var charCode = (e.which) ? e.which : e.keyCode;
        if (charCode != 38 && charCode != 40) {
            charCode=$scope.last_char_code;
        }else{
            $scope.last_char_code=charCode;
        }
        switch (charCode) {
            case 38:
                if ($scope.pad2.posiciony > 0) {
                    $scope.pad2.posiciony -= 4;
                }
                break;
            case 40:
                if ($scope.pad2.posiciony < 380) {
                    $scope.pad2.posiciony += 4;
                }
                break;
            default:

        }
    }
    $scope.stopMoving = function (e) {
        var charCode = (e.which) ? e.which : e.keyCode;
        if (charCode == 38 || charCode == 40) {
            $scope.last_char_code=0;
        }
    }
    $scope.movePad2 = function (e) {
        var charCode2 = (e.which) ? e.which : e.keyCode;
        switch (charCode2) {
            case 119:
                if ($scope.pad1.posiciony > 0) {
                    $scope.pad1.posiciony -= 4;
                }
                break;
            case 115:
                if ($scope.pad1.posiciony < 380) {
                    $scope.pad1.posiciony += 4;
                }
                break;
            default:

        }
    }
}
);
app.directive('pong', function () {
    return {
        restrict: 'E',
        template:
            "<div class='pad' ng-attr-style='transform:translateY({{pad1.posiciony}}px); left:{{pad1.posicionx}}px'></div><div class='ball' ng-attr-style='transform:translate({{ball.posiciony}}px,{{ball.posicionx}}px); '></div>  <div class='pad' ng-attr-style='transform:translateY({{pad2.posiciony}}px); left:{{pad2.posicionx}}px'></div>",
        link: function ($scope, $element, ) {


        }
    };
});