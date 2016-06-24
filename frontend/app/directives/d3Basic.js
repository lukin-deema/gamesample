(function () {
	'use strict';

	angular.module('myApp.directives')
	.directive('d3Bars', ['d3', function(d3) {
		return {
			restrict: 'EA',
			scope: {
				data: "=",
				label: "@",
				onClick: "&",
				width: "=",
				height: "=",
				isName: "="
			},
			link: function(scope, iElement, iAttrs) {
				if (!scope.data) { return }
				var len = scope.data.length;
				var rad = scope.data[0].info.r;
				
				var svg = d3.select(iElement[0])
				.append("svg")
				.attr("width", scope.width || len * (2 * rad + 5))
				.attr("height", scope.height || rad * 2);

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
						.attr("fill", function(d, i){return d.info.fill;})
						.attr("r", function(d, i){return d.info.r;})
						.attr("cx", function(d, i){ 
							return d.info.x || d.info.r + ( 2 * d.info.r + 5) * i;
						})
						.attr("cy", function(d, i){ return d.info.y || d.info.r; })
						.attr("stroke", "black")
						.attr("stroke-width",function(d){ return d.info.isMe ? "2" : "0"; })
						.on("click", function(d, i){ return scope.onClick({item: d}); })
					if (scope.isName) {
						svg.selectAll("text")
							.data(data)
							.enter()
							.append("text")
							.text(function(d){return d.info.name})
							.attr('x', function(d){
								return d.info.x + d.info.r; 
							})
							.attr('y', function(d){
								return d.info.y - d.info.r; 
							})
							.attr("fill",function(d) {return d.info.fill})
					}
				};
			}	
		};
	}]);
}());
