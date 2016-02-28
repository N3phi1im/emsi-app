(function() {
  'use strict';
  angular.module('App')
    .controller('mainController', mainController);

  function mainController(mainService, $window) {

    // Global Variables

    var vm = this;
    vm.data = mainService.main_data;
    vm.percentageReg = [];
    vm.percentageState = [];
    vm.percentageNat = [];
    vm.lineReg = [];
    vm.lineState = [];
    vm.lineNat = [];
    vm.time = [];

    // Function for setting the Jobs percentage and text color compared to National average

    vm.getAverage = function() {
      vm.average = vm.data.summary.jobs.regional / vm.data.summary.jobs.national_avg;
      if (vm.average > 0) {
        angular.element(above_below).append('<span class="positive">above</span>');
      } else {
        angular.element(above_below).append('<span class="negative">below</span>');
      }
    };
    vm.getAverage();

    // Function for setting the Color and symbol for % Change over window of requested Data

    vm.getChange = function() {
      vm.change = vm.data.summary.jobs_growth.regional;
      if (vm.change > 0) {
        angular.element(symbol).append('+');
        angular.element(change).addClass('positive');
      } else {
        angular.element(symbol).append('-');
        angular.element(change).addClass('negative');
      }
    };
    vm.getChange();

    // Function for finding the percentage of change from year to year based on data given then setting that data in proper array

    vm.getPercentage = function() {
      var pChangeReg = vm.data.trend_comparison.regional;
      var pChangeState = vm.data.trend_comparison.state;
      var pChangeNat = vm.data.trend_comparison.nation;
      for (var i = pChangeReg.length - 1; i > 0; i) {
        vm.percentageReg.push(Math.round(((pChangeReg[i] - pChangeReg[i -= 1]) / pChangeReg[i] * 100) * 100) / 100);
      }
      for (var x = pChangeState.length - 1; x > 0; x) {
        vm.percentageState.push(Math.round(((pChangeState[x] - pChangeState[x -= 1]) / pChangeState[x] * 100) * 100) / 100);
      }
      for (var y = pChangeNat.length - 1; y > 0; y) {
        vm.percentageNat.push(Math.round(((pChangeNat[y] - pChangeNat[y -= 1]) / pChangeNat[y] * 100) * 100) / 100);
      }
      vm.percentageReg.reverse();
      vm.percentageState.reverse();
      vm.percentageNat.reverse();
    };
    vm.getPercentage();

    // Loop to set an array with years that the request is built on, for use in later functions

    for (var z = vm.data.trend_comparison.start_year; z < vm.data.trend_comparison.end_year; z++) {
      vm.time.push(z);
    }

    // Constructor to create proper 'x' and 'y' values in an array to plot the D3 line chart

    vm.construct = function() {
      for (var q = 0; q < vm.percentageReg.length; q++) {
        vm.lineReg.push({
          y: vm.percentageReg[q],
          x: vm.time[q]
        });
      }
      for (var r = 0; r < vm.percentageState.length; r++) {
        vm.lineState.push({
          y: vm.percentageState[r],
          x: vm.time[r]
        });
      }
      for (var s = 0; s < vm.percentageNat.length; s++) {
        vm.lineNat.push({
          y: vm.percentageNat[s],
          x: vm.time[s]
        });
      }
    };
    vm.construct();

    // Setup and data injection for the D3 line chart

    var data = [
      vm.lineReg,
      vm.lineState,
      vm.lineNat
    ];

    var colors = [
      '#142850',
      '#1185C4',
      '#ABDAFC'
    ];

    var margin = {
        top: 20,
        right: 150,
        bottom: 30,
        left: 50
      },
      width = $window.innerWidth - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    var x = d3.scale.linear()
      .domain([2001, 2025])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([-20, 70])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(25)
      .tickPadding(10)
      .tickValues([2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025])
      .tickFormat(d3.format("d"))
      .tickSize(-height);

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSubdivide(true)
      .orient("left");

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", (-margin.left) + 10)
      .attr("x", (-height / 2) - 30)
      .text('Percent Change');

    svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);


    var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) {
        return x(d.x);
      })
      .y(function(d) {
        return y(d.y);
      });

    svg.selectAll('.line')
      .data(data)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .attr('stroke', function(d, i) {
        return colors[i % colors.length];
      })
      .attr("d", line);


    var points = svg.selectAll('.dots')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "dots")
      .attr("clip-path", "url(#clip)");

    points.selectAll('.dot')
      .data(function(d, index) {
        var a = [];
        d.forEach(function(point, i) {
          a.push({
            'index': index,
            'point': point
          });
        });
        return a;
      })
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr("r", 2.5)
      .attr('fill', function(d, i) {
        return colors[d.index % colors.length];
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
      });
  }
})();
