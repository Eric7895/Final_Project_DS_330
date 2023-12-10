//define the svg area
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

//define the the axes in parallel coordinate
var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var line = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate("linear");

var axis = d3.svg.axis().orient("left");


//define the array for multi-dimensional data
var cars = []; 

//define the array to hold all lines
//var polyLines = [];
//    dots = [];

//create the svg
var svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//read the data from a file
d3.csv("cars.csv", type, function(error, data) {
    cars = data;//assign the data to the array
    drawpc(); //draw the graph
    //drawxyplot();
});

function drawpc() {
    
    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
                return d != "name" && 
                (y[d] = d3.scale.linear()
                            .domain(d3.extent(cars, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add polylines
    for (var i=0; i< cars.length; i++) {
        var lineData = [];
        
        //prepare data
        for (var prop in cars[i]) {
             if (prop != "name" ) {
                 var point = {};
                 var val = cars[i][prop];
                 point['x'] = x(prop);
                 point['y'] = y[prop](val);
                 lineData.push(point);
             }
        }
        
        //draw a poly line
        var pLine=svg.append("g")
                    .attr("class", "polyline")    
                    .append("path")
                    .attr("d", line(lineData))
                    .on("mouseover", function() {//highlight a line when cursor hovering
                        d3.select(this).style("stroke", "red").style("stroke-width", 5);})                  
                    .on("mouseout", function(d) {//restore the original color
                        d3.select(this).style("stroke", "#666").style("stroke-width", 1);});
                        
//        polyLines.push(pLine); //add a polyline to the array

    }

    //add dimension axes 
    var g = svg.selectAll(".dimension")
	   .data(dimensions)
	   .enter().append("g")
	   .attr("class", "dimension")
	   .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    
    //add an axis and title.
    g.append("g")
	   .attr("class", "axis")
	   .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	   .append("text")
	   .style("text-anchor", "middle")
	   .attr("y", -9)
	   .text(function(d) { return d; });
    
};

function type(d) {
    d.name = +d.name; // coerce to number
    d.Age = +d.Age; // coerce to number
    d.SleepDuration = +d.SleepDuration; // coerce to number
    d.QualityofSleep = +d.QualityofSleep; // coerce to number
    d.PhysicalActivityLevel = +d.PhysicalActivityLevel;
    d.StressLevel = +d.StressLevel;
    d.HeartRate = +d.HeartRate;
    d.DailySteps = +d.DailySteps;
	return d;
}
