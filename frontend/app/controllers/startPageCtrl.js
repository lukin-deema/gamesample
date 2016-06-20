angular.module('myApp').controller('startPageCtrl', function($scope) {
	
	$scope.name = '';
	$scope.send = function(){
		debugger;
	}

	var svg = d3.select("#player-color")
		.append("svg")
		.attr("width", 70)
		.attr("height", 70)
		.append("circle")
		.attr("cx", 35)
		.attr("cy", 35)
		.attr("r", 30)
		.attr("fill","red");

	var array = [{color:"red"}, {color:"blue"}, {color:"black"}]
	var svg2 = d3.select("#colors")
		.append("svg")
		.attr("width", 100)
		.attr("height", 35)
		.selectAll('circle')
		.data(array)
		.enter()
		.append('circle')
		.attr('cx', function(d, i){return i * 30 + 15 })
		.attr("cy", 15)
		.attr('r', 10)
		.attr('fill', function(d){ return d.color})
		.on("click",function(e, i){
			console,log(e)
		})
});