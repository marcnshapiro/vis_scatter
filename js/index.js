var data = [];

var minX = 0;
var maxX = 0;
var maxY = 0;

var convertTicks = function(totalSeconds) {
  var seconds = (totalSeconds - minX) % 60;
  var minutes = ((totalSeconds - minX) - seconds) / 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}



/*
function formatDate(dt) {
  var year = parseInt(dt.substr(0,4));

  switch (dt.substr(5,2)) {
    case "01": qtr =  "4th"; year--; break;
    case "04": qtr =  "1st"; break;
    case "07": qtr =  "2nd"; break;
    case "10": qtr =  "3rd"; break;
  }

  return year.toString() + " - " + qtr + " Qtr.";
}

function display(dates, amts) {
  var height = 500;
  var width = 1000;
  var xMargin = 60;
  var yMargin = 60;

  var maxAmount = d3.max(amts);
  var dateCount = dates.length;
  var minDate = new Date(dates[0]);
  var maxDate = new Date(dates[dateCount - 1]);

  var y = d3.scaleLinear().domain([0, maxAmount]).range([height, 0]);
  var x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  var yAxis = d3.axisLeft(y);
  var xAxis = d3.axisBottom(x);

  var tooltip = d3.select("body").append("div") .attr("class", "tooltip") .style("opacity", 0);

  var canvas = d3.select(".canvas")
    .attr("width", width + xMargin)
    .attr("height", height + yMargin)
    .append("g")
    .attr("transform", "translate(50, 10)")

  canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 25)
    .text("USA GDP in Billions of Dollars");

  canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var points = canvas.selectAll("rect")
    .data(amts)
    .enter()
    .append("rect")
    .attr("class", "dataRect")
    .attr("y", function(d) {
      return y(d);
    })
    .attr("height", function(d) {
      return (height - y(d));
    })
    .attr("width", function(d) {
      return width / dateCount;
    })
    .attr("x", function(d, i) {
      return i * (width / dateCount)
    })
   .on("mouseover", function(d, i) {
     tooltip.transition().duration(200).style("opacity", .9);
     tooltip.html(formatDate(dates[i]) + "<br/>" + amts[i]).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })
   .on("mouseout", function(d) {
     tooltip.transition().duration(500).style("opacity", 0);
    });
}
*/

$(document).ready(function() {
  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(error, json) {
    json.forEach(function(val) {
      var xVal = parseInt(val["Seconds"]);
      var yVal = parseInt(val["Place"]);
      data.push([xVal, yVal]);

    });

    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 900 - margin.left - margin.right
      , height = 600 - margin.top - margin.bottom;

    minX = d3.min(data, function(d) { return d[0]; });
    maxX = d3.max(data, function(d) { return d[0]; });
    maxY = d3.max(data, function(d) { return d[1]; });

    var x = d3.scaleLinear().domain([minX, maxX + 3]).range([ width, 0 ]);    
    var y = d3.scaleLinear().domain([maxY, 1]).range([ height, 0 ]);

    var chart = d3.select('body')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
          
    // draw the x axis with ticks every 10 seconds
    var ticks = [];
    var tick = maxX;

    while (tick >= minX) {
     ticks.push(tick);
     tick -= 10;
    }

    var xAxis = d3.axisBottom(x).tickValues(ticks).tickFormat(convertTicks);

    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(xAxis);

    // draw the y axis
    var yAxis = d3.axisLeft(y);

    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 8)
  });
});