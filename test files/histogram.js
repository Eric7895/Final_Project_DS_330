//margins, width, and height of the chart
var margin = {top: 50, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//create the chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scale of x axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.09); // Determine the space between each bar

//scale of y axis
var y = d3.scale.linear()
    .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
var testArray = [6,1,8,5,2,7,4,3,9];
var bardata=[];
var y_flag = 0; // 0 value ascending 1 value descending 
var x_flag = 0; // 0 name ascending 1 name desending 

d3.tsv("data.tsv", type, function(error, data) {

    //passing the data to bardata
    bardata = data;
    
    //defining the axes
    x.domain(bardata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(bardata, function(d) { return d.number; })]);
    //x axis
    chart.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    //y axis
    chart.append("g")
       .attr("class", "yaxis")
       .call(yAxis);

    //building bars
    chart.selectAll(".bar")
        .data(bardata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.number); })
        .attr("height", function(d) { return height - y(d.number); })
        .attr("width", x.rangeBand())
        .on("mouseover", function () {
            console.log("Over at x: "+d3.mouse(this)[0]+" y: "+d3.mouse(this)[1]+d3.select(this).style("fill", "#00FFFF"));})
        .on("mouseout", function () {
            console.log("Out at x: "+d3.mouse(this)[0]+" y: "+d3.mouse(this)[1]+d3.select(this).style("fill", "steelblue"));})
});


//Clicking on an axis to sort the data
d3.select("svg")
    .on("mousedown", function() {
      console.log("mousedown");
      var coords = d3.mouse(this);
      var xPos = coords[0];
      var yPos = coords[1];
      if (xPos < 40) {
        if (y_flag == 0) {
            //console.log ("Clicking location: x " + xPos + ", y "+ yPos)
            console.log(bardata)
            bardata.sort(function(a,b) {return d3.ascending(a.number, b.number)})
            updateAxis()
            y_flag = 1
        } else if (y_flag == 1) {
            console.log ("Clicking location: x " + xPos + ", y "+ yPos)
            bardata.sort(function(a,b) {return d3.descending(a.number, b.number)})
            updateAxis()
            y_flag = 0
        }
      } else if (yPos > 470) {
        if (x_flag == 0) {
            console.log ("Clicking location: x " + xPos + ", y "+ yPos)
            bardata.sort(function(a,b) {return d3.ascending(a.name, b.name)})
            updateAxis()
            x_flag = 1
        } else if (x_flag == 1) {
            console.log ("Clicking location: x " + xPos + ", y "+ yPos)
            bardata.sort(function(a,b) {return d3.descending(a.name, b.name)})
            updateAxis()
            x_flag = 0
        }
      }
      });

//function to process numerical data 
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}

//function to update the graph
function updateAxis() {
    var x0 = x.domain(bardata.map(function (d) {return d.name;}));
    d3.selectAll(".bar")
    .attr("x", function(d) {return x0(d.name);});
    d3.select(".xaxis").call(xAxis);
}