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

$(document).ready(function() {
  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(error, json) {
    data = json;

    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 900 - margin.left - margin.right
      , height = 600 - margin.top - margin.bottom;

    minX = d3.min(data, function(d) { return d.Seconds; });
    maxX = d3.max(data, function(d) { return d.Seconds; });
    maxY = d3.max(data, function(d) { return d.Place; });

    var x = d3.scaleLinear().domain([minX, maxX + 3]).range([ width, 0 ]);    
    var y = d3.scaleLinear().domain([maxY + 1, 1]).range([ height, 0 ]);

    var chart = d3.select('body')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left + 125)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')
    .attr("style", "border: 1px solid black");

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('id', "chart")
    .attr('class', 'main');  
          
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
   
    g.append("text").text("Ranking")
      .attr('transform', 'translate(-35, 200) rotate(-90)');
    g.append("text").text("Time behind fastest time")
      .attr('transform', 'translate(200, ' + (height + 40) + ')');
  
    var points = g.selectAll("scatter-dots").data(data).enter();

    points.append("circle")
          .attr("cx", function (d,i) { return x(d.Seconds); })
          .attr("cy", function (d) { return y(d.Place); })
          .attr("r", 6)
          .attr("style", function(d) {
              if (d.Doping === "") {
                return "fill:green";
              } else {
                return "fill:red";
              }
          })
         .on("mouseover", function(d, i) {
            var posLeft = Math.max(($("body").width() - width - 50)/2, margin.left + 15) + "px";
            var posTop = $("#canvas").offset().top + 15 + "px";
            var tooltip = d3.select("#tooltip").style("left", posLeft).style("top", posTop);

            tooltip.transition().duration(200).style("opacity", .9);
            var html = "Cyclist: " + d.Name + "<br/>"
            html += "Nationality: " + d.Nationality + "<br/>";
            html += "Year: " + d.Year + "<br/>";
            html += "Time: " + d.Time + "<br/><br/>";
            html += d.Doping != "" ? d.Doping : "No doping alegations";
            tooltip.html(html);
          })
         .on("mouseout", function(d) {
          var tooltip = d3.select("#tooltip");
           tooltip.transition().duration(500).style("opacity", 0);
          })
    points.insert("text")
          .attr("x", function(d, i) { return x(d.Seconds) + 15; })
          .attr("y", function(d) { return y(d.Place) + 6; })
          .text(function(d) { return d.Name; });
  });
});