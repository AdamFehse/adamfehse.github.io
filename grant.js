const csvFiles = [
  "Challenge Programs.csv",
  "Digital Humanities.csv",
  "Education.csv",
  "FedState Partnership.csv",
  "Preservation Access.csv",
  "Public Programs.csv",
  "Research Programs.csv",
];

// Load all CSV files and build the hierarchy
Promise.all(csvFiles.map((file) => d3.csv(file)))
  .then(function (allData) {
    // Create a root hierarchy with divisions as children
    const hierarchy = {
      name: "Grants Divisions",
      children: allData.map((csvData, i) => ({
        name: getDivisionName(csvFiles[i]),
        children: csvData.map((grant) => ({
          name: grant.title, // Access the title field
          href: grant.href.replace(
            "http://127.0.0.1:5500",
            "https://www.neh.gov"
          ), // Replace base URL
          deadline: grant.deadline, // Access the deadline field
          output: grant.output, // Access the output field
        })),
      })),
    };

    // Visualize the hierarchy as a tree
    drawTree(d3.hierarchy(hierarchy));
  })
  .catch((error) => console.error("Error loading CSV files:", error));

// Helper function to get the division name from the file name
function getDivisionName(filename) {
  return filename.replace(".csv", "").replace(/-/g, " ").replace(/_/g, " ");
}

// Function to draw the tree
function drawTree(root) {
  const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Adjust the size of the tree to provide vertical space
  const treeLayout = d3
    .tree()
    .size([height - 100, width - 1300])
    .separation((a, b) => (a.parent == b.parent ? 1 : 1.5));

  // Assign positions to nodes
  treeLayout(root);

  // Create a group and apply a translation to shift the tree down
  const g = svg.append("g").attr("transform", "translate(100, 10)"); // Shift the entire tree right and down

  // Create links between nodes
  g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkHorizontal()
        .x((d) => d.y + 10)
        .y((d) => d.x)
    );

  // Create nodes
  const node = g
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.y + 14},${d.x})`)
    .on("click", function (event, d) {
      // Handle root node click
      if (d.depth === 0) {
        window.open("https://www.neh.gov/divisions-offices", "_blank");
      }
      // Handle division nodes click
      else if (d.depth === 1) {
        const divisionLinks = {
          "Challenge Programs": "https://www.neh.gov/divisions/challenge",
          "Digital Humanities": "https://www.neh.gov/divisions/odh",
          Education: "https://www.neh.gov/divisions/education",
          "FedState Partnership": "https://www.neh.gov/divisions/fedstate",
          "Preservation Access": "https://www.neh.gov/divisions/preservation",
          "Public Programs": "https://www.neh.gov/divisions/public",
          "Research Programs": "https://www.neh.gov/divisions/research",
        };
        const divisionName = d.data.name;
        if (divisionLinks[divisionName]) {
          window.open(divisionLinks[divisionName], "_blank");
        }
      }
      // Handle leaf nodes (grants) click
      else if (d.data.href) {
        window.open(d.data.href, "_blank");
      }
    });

  node
    .append("circle")
    .attr("r", (d) => (d.depth === 0 ? 5 : 3)) // Larger root circle, smaller leaf circles
    .style("fill", (d) => (d.depth === 0 ? "blue" : "grey")) // Color root nodes differently
    .style("stroke", "black")
    .style("stroke-width", 0.5);

  node
    .on("mouseover", function () {
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", 6)
        .style("fill", "orange");
    })
    .on("mouseout", function () {
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", (d) => (d.depth === 0 ? 5 : 3))
        .style("fill", (d) => (d.depth === 0 ? "blue" : "grey"));
    });

  // Add text labels for nodes with word wrap
  node
    .append("text")
    .attr("dy", 0.3)
    .attr("dx", (d) => (d.children ? -4 : 4))
    .style("text-anchor", (d) => (d.children ? "end" : "start"))
    .style("font-size", "13px")
    .style("fill", (d) =>
      document.body.classList.contains("light-mode") ? "black" : "white"
    ) // Dynamically adjust text color based on mode
    .text((d) => d.data.name + (d.data.output ? `: ${d.data.output}` : ""))
    .call(wrapText, 800); // Max width for wrapping text
}

// Function to wrap text with controlled line height and avoid excessive space
function wrapText(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 0.8, // Reduced line height to 1.1 to minimize vertical spacing
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 2)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

function toggleLightDarkMode() {
  const body = document.body;
  body.classList.toggle("light-mode"); // Toggle the 'light-mode' class

  // After toggling the mode, update the text color of all node texts
  d3.selectAll(".node, text").style("fill", function () {
    return body.classList.contains("light-mode") ? "black" : "white";
  });
}
