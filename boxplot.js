// Function to draw the boxplot for a given variable
function drawBoxplot(selectedVariable) {
    // Clear any previous svg content
    const svg = d3.select(".boxplot");
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the data
    d3.csv("Sleep.csv").then(function(data) {
        // Convert all data to numerical values
        data.forEach(function(d) {
            d[selectedVariable] = +d[selectedVariable];
        });

        // Filter non-numeric values as they cannot be used in a boxplot
        data = data.filter(function(d) { return !isNaN(d[selectedVariable]); });

        const values = data.map(d => d[selectedVariable]).sort(d3.ascending);
        const q1 = d3.quantile(values, .25);
        const median = d3.quantile(values, .5);
        const q3 = d3.quantile(values, .75);
        const interQuantileRange = q3 - q1;
        const lowerWhisker = Math.max(d3.min(values), q1 - 1.5 * interQuantileRange);
        const upperWhisker = Math.min(d3.max(values), q3 + 1.5 * interQuantileRange);

        const x = d3.scaleLinear()
            .domain([d3.min(values), d3.max(values)])
            .range([0, width]);

        const y = d3.scaleBand()
            .range([height, 0])
            .domain([selectedVariable])
            .padding(0.2);

        // Box
        g.append("rect")
            .attr("x", x(q1))
            .attr("y", y(selectedVariable))
            .attr("width", x(q3) - x(q1))
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2");

        // Median line
        g.append("line")
            .attr("x1", x(median))
            .attr("x2", x(median))
            .attr("y1", y(selectedVariable))
            .attr("y2", y(selectedVariable) + y.bandwidth())
            .attr("stroke", "black");

        // Whiskers
        g.append("line")
            .attr("x1", x(lowerWhisker))
            .attr("x2", x(upperWhisker))
            .attr("y1", y(selectedVariable) + y.bandwidth() / 2)
            .attr("y2", y(selectedVariable) + y.bandwidth() / 2)
            .attr("stroke", "black");

        // Whisker caps
        g.append("line")
            .attr("x1", x(lowerWhisker))
            .attr("x2", x(lowerWhisker))
            .attr("y1", y(selectedVariable))
            .attr("y2", y(selectedVariable) + y.bandwidth())
            .attr("stroke", "black");

        g.append("line")
            .attr("x1", x(upperWhisker))
            .attr("x2", x(upperWhisker))
            .attr("y1", y(selectedVariable))
            .attr("y2", y(selectedVariable) + y.bandwidth())
            .attr("stroke", "black");

        // Outliers
        const outliers = data.filter(d => d[selectedVariable] < lowerWhisker || d[selectedVariable] > upperWhisker);

        g.selectAll(".outlier")
            .data(outliers)
            .enter().append("circle")
            .attr("class", "outlier")
            .attr("cx", function(d) { return x(d[selectedVariable]); })
            .attr("cy", y(selectedVariable) + y.bandwidth() / 2)
            .attr("r", 3)
            .attr("fill", "red");
    });
}

// Initial call to draw the boxplot for the default selected variable
drawBoxplot("Age"); // Replace "Age" with your default variable

// Event listener for the dropdown change
d3.select("#boxplotVariable").on("change", function() {
    // Get the newly selected variable
    var newVariable = d3.select(this).property("value");
    
    // Redraw the boxplot with the new variable
    drawBoxplot(newVariable);
});
