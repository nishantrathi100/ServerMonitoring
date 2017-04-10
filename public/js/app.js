/**
* Main AngularJS Web Application
*/
angular.module('ServerMonitorDashboard', ['ngRoute']).
config(['$routeProvider', function($routeProvider) {
$routeProvider
.when('/', {
templateUrl: 'partials/home.html',
controller: 'HomeController'
});
}]);
