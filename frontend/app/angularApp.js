'use strict';

angular.module('myApp', [
	'ui.router',  'myApp.directives', 'myApp.controllers'
]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider.state('app', {
		url: '/',
		templateUrl: 'app/views/startPage.html',
		controller: 'startPageCtrl'
	});
}]).run(function () {

}); 
angular.module('d3', []);
angular.module('myApp.controllers', []);
angular.module('myApp.directives', ['d3']);
