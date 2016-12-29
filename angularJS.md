指令和绑定
ng-app
ng-model
ng-init
ng-repeat
ng-if
ng-view
ng-click

Api函数

// 创建模块
var app = angular.module('APPNAME', []);

// 创建控制器
app.controller('mainController', ["$scope", function($scope) {
    //...statement
});

// 创建服务
app.factory("listServer", function() {
    return function(args) {
        //...statement
    }
});

// 控制器注入服务
app.controller('listController', ['$scope', 'listServer', function($scope, listServer) {
    $scope.name = '123';
    $scope.click = function() {
        $scope.name = listServer();
    }
}]);

// 路由
var bpp = angular.module('app2', ['ngRoute']);
bpp.config(['$routeProvider', function($routeProvider) {
    var r = $routeProvider;
    r.when('/list', {controller: 'listController', templateUrl: 'list.html'});
    r.when('/view/:id', {controller: 'viewController', templateUrl: 'view.html'});
    r.when('/', {redrictTo: '/list'});
    r.otherwise({redrictTo: '/list'});
}]);
bpp.factory('viewServer', function() {
    return function() {
        return aa;
    }
});
bpp.controller('viewController', ['$scope', 'viewServer', '$routeParams', function() {

}]);
