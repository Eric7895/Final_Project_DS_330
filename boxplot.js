// Load the data
d3.csv("Sleep.csv", function (error, data) {
    if (error) {
        console.error("Error loading data:", error);
        return;
    }

    // Set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select(".boxplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a function to prepare the data for boxplot
    function prepareBoxplotData(data, variable) {
        var boxplotData = d3.nest()
            .key(function (d) { return d[variable]; })
            .rollup(function (d) {
                var values = d.map(function (item) {
                    return +item[variable]; // Convert to numeric value
                });

                var sortedValues = values.slice().sort(d3.ascending);

                var q1 = d3.quantile(sortedValues, 0.25);
                var median = d3.quantile(sortedValues, 0.5);
                var q3 = d3.quantile(sortedValues, 0.75);

                var interQuantileRange = q3 - q1;
                var min = q1 - 1.5 * interQuantileRange;
                var max = q3 + 1.5 * interQuantileRange;

                // Filter outliers within the range
                var outliers = values.filter(function (d) { return d < min || d > max; });

                return {
                    outliers: outliers,
                    q1: q1,
                    median: median,
                    q3: q3,
                    min: min,
                    max: max
                };
            })
            .entries(data);

        return boxplotData;
    }

    // Choose the variable you want to visualize
    var selectedVariable = "age"; // Change this to the desired variable

    // Prepare the data for the selected variable
    var boxplotData = prepareBoxplotData(data, selectedVariable);

    console.log("Boxplot Data:", boxplotData);

    // Build and show the Y scale
    var y = d3.scaleBand()
        .domain(boxplotData.map(function (d) { return d.key; }))
        .range([height, 0])
        .padding(0.1);

    console.log("Y Domain:", y.domain());

    // Build and show the X scale
    var x = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return +d[selectedVariable]; }), d3.max(data, function (d) { return +d[selectedVariable]; })])
        .range([0, width]);

    console.log("X Domain:", x.domain());

    // Build the boxplots
    svg.selectAll(".box")
        .data(boxplotData)
        .enter().append("g")
        .attr("transform", function (d) { return "translate(0," + y(d.key) + ")"; })
        .append("rect")
        .attr("x", function (d) { return x(d.value.min); })
        .attr("y", y.bandwidth() / 4)
        .attr("width", function (d) { return x(d.value.max) - x(d.value.min); })
        .attr("height", y.bandwidth() / 2)
        .style("fill", "#69b3a2")
        .attr("stroke", "black");

    // Add a dot for each outlier
    svg.selectAll(".outlier")
        .data(boxplotData)
        .enter().append("g")
        .attr("transform", function (d) { return "translate(0," + y(d.key) + ")"; })
        .selectAll("circle")
        .data(function (d) { return d.value.outliers; })
        .enter().append("circle")
        .attr("cx", function (d) { return x(d); })
        .attr("cy", y.bandwidth() / 2)
        .attr("r", 3)
        .style("fill", "red");

    // Add a line for the median
    svg.selectAll(".median")
        .data(boxplotData)
        .enter().append("g")
        .attr("transform", function (d) { return "translate(0," + y(d.key) + ")"; })
        .append("line")
        .attr("x1", function (d) { return x(d.value.median); })
        .attr("x2", function (d) { return x(d.value.median); })
        .attr("y1", y.bandwidth() / 4)
        .attr("y2", y.bandwidth() / 1.33)
        .style("stroke", "black");

    // Add a box for the main box
    svg.selectAll(".box")
        .data(boxplotData)
        .enter().append("g")
        .attr("transform", function (d) { return "translate(0," + y(d.key) + ")"; })
        .append("rect")
        .attr("x", function (d) { return x(d.value.q1); })
        .attr("y", y.bandwidth() / 4)
        .attr("width", function (d) { return x(d.value.q3) - x(d.value.q1); })
        .attr("height", y.bandwidth() / 2)
        .style("fill", "#69b3a2")
        .attr("stroke", "black");
});
