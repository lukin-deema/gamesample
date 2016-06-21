(function () {
	'use strict';

	angular.module('myApp.directives')
	.directive('d3Bars', ['d3', function(d3) {
		return {
			restrict: 'EA',
			scope: {
				data: "=",
				label: "@",
				onClick: "&"
			},
			link: function(scope, iElement, iAttrs) {
				var width = scope.data.length;
				var svg = d3.select(iElement[0])
				.append("svg")
				.attr("width", width * 60)
				.attr("height", 60);

				// on window resize, re-render d3 canvas
				window.onresize = function() {
					return scope.$apply();
				};
				scope.$watch(function(){
					return angular.element(window)[0].innerWidth;
				}, function(){
					return scope.render(scope.data);
				});

				// watch for data changes and re-render
				scope.$watch('data', function(newVals, oldVals) {
					return scope.render(newVals);
				}, true);

				// define render function
				scope.render = function(data){
					// remove all previous items before render
					svg.selectAll("*").remove();
					
					//create the rectangles for the bar chart
					svg.selectAll("circle")
						.data(data)
						.enter()
						.append("circle")
						.on("click", function(d, i){return scope.onClick({item: d});})
						.attr("fill", function(d, i){return d.fill;})
						.attr("r", function(d, i){return d.r;})
						.attr("cx", function(d, i){
							return i * 2.5 * d.r + d.r ;
						})
						.attr("cy", 30)
						.on("click", function(d, i){
							return scope.onClick({item: d});
						})
				};
			}	
		};
	}]);
}());
