'use strict';

angular.module('myApp', [
	'ui.router',  'myApp.directives', 'myApp.controllers'
]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider.state('app', {
		url: '/',
		templateUrl: 'app/views/startPage.html',
		controller: 'startPageCtrl'
	})
	.state('field', {
		url:'/field',
		templateUrl: 'app/views/fieldPage.html',
		controller: 'fieldPageCtrl',
		params: { userCircle: null/*{fill:'red',name:"asada"}*/ }
	});
}]).run(function () {

}); 
angular.module('d3', []);
angular.module('socket', []);
angular.module('myApp.controllers', ['socket']);
angular.module('myApp.directives', ['d3']);