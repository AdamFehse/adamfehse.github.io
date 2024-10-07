

// Select the div and set dimensions
let div1 = d3.select("#div1");

// Chart dimensions 
const width = 500;
const height = 500;
const marginTop = 10;

// Append the SVG container to div1
const svg1 = div1.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "scatterplot1");

// Append a rectangle as the background
const background = svg1.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white"); // Set initial background color

// Append text to the SVG
const textElement = svg1.append("text")
    .attr("x", width / 2)            // Center text horizontally
    .attr("y", marginTop)            // Position text vertically from the top
    .attr("text-anchor", "middle")   // Center the text
    .attr("font-size", "16px")       // Set font size
    .attr("fill", "black")           // Set initial text color
    .text("My Scatterplot Title");    // Set the text content

// Initialize color variables
let currentTextColor = "black";
let currentBgColor = "white";

// Append a button
div1.append("button")
    .text("Change Text and Background Color")
    .on("click", function() {
        // Toggle colors between black/red for text and white/gray for background
        currentTextColor = currentTextColor === "black" ? "white" : "black";
        currentBgColor = currentBgColor === "white" ? "black" : "white";
        
        // Update the text color in the SVG
        textElement.attr("fill", currentTextColor);
        
        // Update the background color
        background.attr("fill", currentBgColor);
    });
