let projectData = [];

// Load CSV data on page load
document.addEventListener("DOMContentLoaded", () => {
  fetch("/storymapdata.csv")
    .then((response) => response.text())
    .then((data) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          projectData = results.data; // Store parsed data
          console.log(projectData[0]);
          addMarkersToMap(projectData); // Add markers after parsing
        },
      });
    });
});

function showContent(category, keyword = "") {
  const contentDiv = document.getElementById("mainContent");

  const filteredProjects = projectData.filter(
    (project) =>
      project["Project Category"] === category &&
      (keyword === "" || project["Project Type"] === keyword)
  );

  let tableHTML = `
        <h3 class="text-center">${category}${
    keyword ? " - " + keyword : ""
  }</h3>
        <div id="scrollableTableContainer">
            <table class="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Project Image</th>
                        <th>Project Name</th>
                    </tr>
                </thead>
                <tbody>
    `;

  filteredProjects.forEach((project) => {
    tableHTML += `
            <tr class="project-row" data-project-name="${
              project["Project Name"]
            }" role="button">
                <td class="image-cell">
                    <div class="image-placeholder">
                        <img src="${
                          project["ImageUrl"] ||
                          "https://via.placeholder.com/100"
                        }" alt="Project Image">
                    </div>
                </td>
                <td>${project["Project Name"]}</td>
            </tr>
        `;
  });

  tableHTML += `
                </tbody>
            </table>
        </div>
    `;

  contentDiv.innerHTML = filteredProjects.length
    ? tableHTML
    : `<p class="text-center">No projects found for ${category}${
        keyword ? " - " + keyword : ""
      }.</p>`;

  // Add click event listeners to each row
  document.querySelectorAll(".project-row").forEach((row) => {
    row.addEventListener("click", () => {
      const projectName = row.getAttribute("data-project-name");
      highlightMarker(projectName);
    });
  });
}

// Global marker storage
const markers = {};

function addMarkersToMap(data) {
  data.forEach((row) => {
    const lat = parseFloat(row.Latitude);
    const lng = parseFloat(row.Longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`
                <strong>Project Name:</strong> ${
                  row["Project Name"] || "N/A"
                }<br>
                <strong>Category:</strong> ${
                  row["Project Category"] || "N/A"
                }<br>
                <strong>Description:</strong> ${
                  row["DescriptionShort"] || "No description available."
                }<br>
                <img src="${
                  row["ImageUrl"] || "https://via.placeholder.com/100"
                }" alt="Project Image" style="width:100px;">
                <br><button class="btn btn-primary btn-sm mt-2" onclick="showModal('${
                  row["Project Name"]
                }', '${row["DescriptionLong"]}', '${row["ImageUrl"]}')">
                    More Details
                </button>
            `);

      // Store marker with project name as the key
      markers[row["Project Name"]] = marker;
      //console.log(row['Description']);
    }
  });
}

function showModal(
  projectName,
  description,
  imageUrl,
  affiliation,
  college,
  email
) {
  const modalTitle = document.getElementById("customModalLabel");
  modalTitle.innerHTML = projectName || "Project Details";

  // Store data in a global variable for easy access
  window.currentProjectData = {
    description: description || "No description available.",
    affiliation: affiliation || "N/A",
    college: college || "N/A",
    email: email || "N/A",
    imageUrl: imageUrl || "https://via.placeholder.com/300",
  };

  // Reset main content area
  const mainContent = document.getElementById("modalDynamicContent");
  mainContent.innerHTML = `
      <div class="text-center">
        <img src="${window.currentProjectData.imageUrl}" alt="Project Image" style="width: 300px; margin-bottom: 15px;">
        <p>Select a category on the left to load more details.</p>
      </div>
    `;

  // Show the Bootstrap modal
  const customModal = new bootstrap.Modal(
    document.getElementById("customModal")
  );
  customModal.show();
}

// Event listener for category clicks
document.addEventListener("click", function (e) {
  if (e.target && e.target.matches("#categoryList .list-group-item-action")) {
    const category = e.target.getAttribute("data-category");
    loadCategoryContent(category);
  }
});

function loadCategoryContent(category) {
  if (!window.currentProjectData) return;

  const mainContent = document.getElementById("modalDynamicContent");
  // Clear existing content
  mainContent.innerHTML = "";

  // Display data based on category
  let contentHTML = "";
  switch (category) {
    case "description":
      contentHTML = `<p><strong>Description:</strong> ${window.currentProjectData.description}</p>`;
      break;
    case "affiliation":
      contentHTML = `<p><strong>Affiliation:</strong> ${window.currentProjectData.affiliation}</p>`;
      break;
    case "college":
      contentHTML = `<p><strong>College:</strong> ${window.currentProjectData.college}</p>`;
      break;
    case "email":
      contentHTML = `<p><strong>Email:</strong> ${window.currentProjectData.email}</p>`;
      break;
    default:
      contentHTML = `<p>No data available for this category.</p>`;
  }

  mainContent.innerHTML = contentHTML;
}

// Define a large icon for highlighting
const defaultIcon = L.icon({
  iconUrl: "/hands.png", // Use an appropriate larger icon here
  iconSize: [40, 40], // Adjust size to be larger than the default
  iconAnchor: [20, 40], // Center the icon appropriately
});

window.defaultIcon = defaultIcon; // Make sure this line is present

// Function to highlight a marker by project name
function highlightMarker(projectName) {
  // Reset any previously highlighted marker (if needed)
  if (window.currentHighlightedMarker && window.defaultIcon) {
    window.currentHighlightedMarker.setIcon(window.defaultIcon);
  }

  // Find the new marker
  const marker = markers[projectName];
  if (marker) {
    window.currentHighlightedMarker = marker;
    marker.openPopup(); // Show the popup
  
    // Zoom out with a smooth fly-to animation
    setTimeout(() => {
      map.flyTo(marker.getLatLng(), 11, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }, 500);
  
    // Then zoom back in with another smooth fly-to
    setTimeout(() => {
      map.flyTo(marker.getLatLng(), 19, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }, 2500);
  }
  
}
