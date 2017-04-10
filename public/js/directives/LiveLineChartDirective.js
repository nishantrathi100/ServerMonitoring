angular.module('ServerMonitorDashboard')
.directive('liveLineChart', function () {
  return {
    restrict: 'E',
    scope: {
      liveDataMethod: '&liveData'
    },
    link: function (scope, element, attrs) {
      var
		n = 80,
		random = d3.random.normal(0, 0),
		data = d3.range(n).map(function(i) {return random()}),
		dataMin = Math.floor(d3.min(data)),
		dataMax = Math.ceil(d3.max(data)),
		currentHeight = 0,
		margin = {top: 30, right: 20, bottom: 30, left: 40},
		width,
		height,
		svg,
		x,
		y,
		line,
		path,
		duration = 500,
    	now = new Date(Date.now() - duration),
    	transition,
    	count = 0,
    	axisX,
    	axisY,
    	xLine;

      var liveDataMethod = scope.liveDataMethod();
      var createXScale = function() {
		xLine = d3.scale.linear()
			.domain([0, n - 1])
			.range([0, width]);

		x = d3.time.scale()
	    .domain([now - (n - 2) * duration, now - duration])
	    .range([0, width]);

	};


	var updateDomains = function() {
		dataMin = Math.floor(d3.min(data));
		dataMax = Math.ceil(d3.max(data));
		now = new Date();
		x.domain([now - (n - 2) * duration, now - duration]);
		y.domain([dataMin, dataMax]);
	};


	var updateAxes = function() {
		axisX.attr("transform", "translate(0," + y(0) + ")")
		axisX.call(x.axis);
		axisY.call(y.axis);
	};


	var createYScale = function() {
		y = d3.scale.linear()
			.domain([dataMin, dataMax])
			.range([height, 0]);
	};


	var createScales = function() {
		createYScale();
		createXScale();
	}

  var determineWidthAndHeight = function() {
    width = $('.wrapper').width() - margin.left - margin.right,
		height = $('.wrapper').height() - margin.top - margin.bottom;
    //width = $('.wrapper').width() - margin.left - margin.right,
		//height = $('.wrapper').height() - margin.top - margin.bottom;
	};
      //d3.select(element[0]).attr('height','100%');
      //d3.select(element[0]).node().getBoundingClientRect().height = '100%';
      //d3.select(element[0]).node().getBoundingClientRect().width = '100%';
      //console.log(d3.select(element[0]).node().getBoundingClientRect().height);
      var createSVG = function() {
        svg = d3.select(element[0])
        .append("svg")
        .attr('class','svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var createLine = function() {
		line = d3.svg.line()
			.x(function(d, i) { return xLine(i); })
			.y(function(d, i) { return y(d); })
	};


	var createXAxis = function() {
		axisX = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + y(0) + ")")
			.call(x.axis = d3.svg.axis().scale(x).orient("bottom")
			.ticks(15)
			.tickFormat(d3.time.format("%H:%M:%S")));
		};


	var createYAxis = function() {
		axisY = svg.append("g")
			.attr("class", "y axis")
			.call(y.axis = d3.svg.axis().scale(y).orient("left"));
	};


	var appendAxis = function() {
		createXAxis();
		createYAxis();
	};

  var applyPathMagic = function() {
		svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);
		path = svg.append("g")
			.attr("clip-path", "url(#clip)")
			.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);
	};

  var render = function() {
    determineWidthAndHeight();
		createScales();
		createSVG();
		createLine();
		appendAxis();
		applyPathMagic();
	};


	transition = d3.select({}).transition()
    .duration(duration)
    .ease("linear");

    var tick = function() {

		transition = transition.each(function() {

      var d = liveDataMethod();
      //var temp = random();

			data.push(d);
			path.attr("d", line)
				.attr("transform", null)
				.transition()
				.ease('linear')
				.duration(duration)
				.attr("transform", "translate(" + xLine(-1) + ",0)")

			svg.select(".line")
				.attr("d", line)
				.attr("transform", null);

			updateDomains();
			updateAxes();

			path.transition()
				.attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

			data.shift();
		}).transition().each("start", tick);

	};

  render();
	tick();


    }
  }
});
