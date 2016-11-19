  function convertTicks(totalSeconds, fastestTime) {
  var seconds = (totalSeconds - fastestTime) % 60;
  var minutes = ((totalSeconds - fastestTime) - seconds) / 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function color(doping, selected) {
  if (selected === true) {
    if (doping === "") {
      return "#33ff33";
    } else {
      return "#ff3333";
    }
  } else {
    if (doping === "") {
      return "#00cc00";
    } else {
      return "#aa0000";
    }
  }
}

function showTip(obj, d, width, margin) {
  var posLeft = Math.max(($("body").width() - width - 50)/2, margin.left + 15) + "px";
  var posTop = $("#canvas").offset().top + 15 + "px";

  var html = "Cyclist: " + d.Name + "<br/>";
  html += "Nationality: " + d.Nationality + "<br/>";
  html += "Year: " + d.Year + "<br/>";
  html += "Time: " + d.Time + "<br/><br/>";
  html += d.Doping != "" ? d.Doping : "No doping alegations";

  d3.select("#tooltip").style("left", posLeft).style("top", posTop).html(html).transition().duration(200).style("opacity", .9);
  d3.select(obj).attr("class", "mouseover").attr("fill", function(d) {return color(d.Doping, true);}); 
}

function hideTip(obj, d) {
  d3.select("#tooltip").transition().duration(500).style("opacity", 0);
  d3.select(obj).attr("class", "").attr("fill", function(d) {return color(d.Doping, false);});
}

$(document).ready(function() {
  var minX = 0;
  var maxX = 0;
  var maxY = 0;

 var data = [];

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = 900 - margin.left - margin.right
    , height = 600 - margin.top - margin.bottom;

  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(error, json) {
    data = json;

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

    var xAxis = d3.axisBottom(x).tickValues(ticks).tickFormat(function(d) {return convertTicks(d, minX);});

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

    var g = main.append("g"); 
   
    g.append("text").text("Ranking")
      .attr('transform', 'translate(-35, ' + height/2 + ') rotate(-90)').style("font-weight", "bold").style("font-size", "18px")
      .style("font-weight", "bold").style("font-size", "18px")
      .style("text-anchor", "middle");

    g.append("text").text("Minutes behind fastest time")
      .attr('transform', 'translate(' + (width)/2 + ', ' + (height + 40) + ')')
      .style("font-weight", "bold").style("font-size", "18px")
      .style("text-anchor", "middle");
  
    var points = g.selectAll("scatter-dots").data(data).enter();

    points.append("circle")
      .attr("cx", function (d,i) { return x(d.Seconds); })
      .attr("cy", function (d) { return y(d.Place); })
      .attr("r", 6)
      .attr("fill", function(d) {return color(d.Doping, false);})
      .on("mouseover", function(d) {showTip(this, d, width, margin);})
      .on("mouseout", function(d) {hideTip(this, d);}) 
    points.insert("text")
      .attr("x", function(d, i) { return x(d.Seconds) + 15; })
      .attr("y", function(d) { return y(d.Place) + 6; })
      .text(function(d) { return d.Name; });
  });
});