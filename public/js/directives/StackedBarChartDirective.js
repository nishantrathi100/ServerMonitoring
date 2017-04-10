angular.module('ServerMonitorDashboard')
.directive('stackedBarChart', function () {
  return {
    restrict: 'E',
    scope: {
      chartData: '='
    },
    link: function (scope, element, attrs) {

        var causes = ["in", "out"];

  var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

  var margin = {top: 20, right: 50, bottom: 30, left: 20},
      width = $('.wrapper-sec').width() - margin.left - margin.right,
      height = $('.wrapper-sec').height() - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width]);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var z = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) {
        var dt = new Date(d);
        formatDate = d3.time.format("%m/%d");
        return formatDate(dt);
      });

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right");

  var svg;

  var drawChart = function(data) {
    d3.select(element[0]).selectAll("svg").remove();
    svg = d3.select(element[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layers = d3.layout.stack()(causes.map(function(c) {
      return data.map(function(d) {
        return {x: d.date, y: d[c]};
      });
    }));

    x.domain(layers[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

    var layer = svg.selectAll(".layer")
        .data(layers)
      .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return z(i); });

    layer.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y + d.y0); })
        .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
        .attr("width", x.rangeBand() - 1);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);
  }

        scope.$watch('chartData', function (newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }
          else {
            drawChart(newVal);
          }
        });

  function type(d) {
    d.date = parseDate(d.date);
    causes.forEach(function(c) { d[c] = +d[c]; });
    return d;
  }

    }
  }
});
