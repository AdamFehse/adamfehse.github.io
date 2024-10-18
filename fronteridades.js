let totalKeywordFrequency = {}; // Object to hold total keyword frequencies

// Function to get a random color for the words
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Function to extract title, description, and text content from an external HTML file
function extractTextFromProjects(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const projectCards = doc.querySelectorAll('.card');  // Look for .card in the loaded document
    let projectsData = []; // Array to hold project data

    projectCards.forEach(card => {
        const title = card.querySelector('.card-title').innerText.trim();
        const description = card.querySelector('.card-text').innerText.trim();
        const fullText = title + ' ' + description;

        // Generate keywords for this project
        const keywords = generateKeywordList(fullText);

        // Store keyword frequencies for this project and accumulate total frequencies
        keywords.forEach(([word, count]) => {
            totalKeywordFrequency[word] = (totalKeywordFrequency[word] || 0) + count; // Update global frequency
        });

        // Store each project with its title and full text
        projectsData.push({ title, fullText, keywords }); // Include keywords for individual charts
    });

    return projectsData;
}

// Function to clean text, remove common stopwords, and generate a keyword list
function generateKeywordList(text) {
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanedText.split(/\s+/);

    const stopwords = ['the', 'and', 'in', 'of', 'to', 'a', 'with', 'for', 'on', 'is', 'by', 'an', 'it', 'as', 'are',
        'will', 'has', 'their', 'from', 'how', 'that', 'this', 'was', 'have', 'these', 'through', 'these' , ' was',
        'who ', 'Was', 'Who', 'Has', 'Will', 'That', 'They'
    ];
    const wordFrequency = {};

    words.forEach(word => {
        if (!stopwords.includes(word) && word.length > 2) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });

    const sortedKeywords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
    return sortedKeywords;
}

// Function to print charts for projects
function printChartsForProjects(projectsData) {
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = ''; // Clear any existing charts

    projectsData.forEach((project, index) => {
        // Create a Bootstrap row for the word cloud and bar chart
        const projectRow = document.createElement('div');
        projectRow.classList.add('row', 'mb-4'); // 'mb-4' for margin below each project row

        // Create a Bootstrap column for the word cloud
        const wordCloudCol = document.createElement('div');
        wordCloudCol.classList.add('col-lg-6');

        // Create a canvas for the word cloud
        const wordCloudCanvasId = `wordCloud-${index}`;
        const wordCloudCanvas = document.createElement('canvas');
        wordCloudCanvas.width = 900; // Set canvas width for word cloud
        wordCloudCanvas.height = 400; // Set canvas height for word cloud
        wordCloudCanvas.id = wordCloudCanvasId;
        wordCloudCol.appendChild(wordCloudCanvas); // Append canvas to the word cloud column

        // Create a Bootstrap column for the bar chart
        const barChartCol = document.createElement('div');
        barChartCol.classList.add('col-lg-6');

        // Create a canvas for the bar chart
        const barChartCanvasId = `barChart-${index}`;
        const barChartCanvas = document.createElement('canvas');
        barChartCanvas.id = barChartCanvasId;
        barChartCol.appendChild(barChartCanvas); // Append canvas to the bar chart column

        // Append both columns to the row
        projectRow.appendChild(wordCloudCol);
        projectRow.appendChild(barChartCol);

        // Append the row to the main charts container
        chartsContainer.appendChild(projectRow);

        // Generate the word cloud and bar chart using the keywords from this project
        createWordCloud(project.title, project.keywords, wordCloudCanvasId);
        createBarChart(project.title, project.keywords, barChartCanvasId);
    });
}

// Function to create a bar chart using Chart.js
function createBarChart(projectTitle, keywordList, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Get the top X keywords
    const topKeywords = keywordList.slice(0, 10);

    // Map the labels and data using only the top X keywords
    const labels = topKeywords.map(([word]) => word); // Extract words for labels
    const data = topKeywords.map(([, count]) => count); // Extract counts for data

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Keyword Frequency for "${projectTitle}"`,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Makes the chart responsive
            maintainAspectRatio: true, // Prevents maintaining aspect ratio
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Keywords',
                    },
                    ticks: {
                        autoSkip: true, // Automatically skips some labels
                        maxRotation: 45, // Maximum label rotation
                        minRotation: 30,  // Minimum label rotation
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency',
                    },
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip format
                        }
                    }
                }
            }
        }
    });
}

// Function to create a word cloud using HTML5 Canvas
function createWordCloud(projectTitle, keywordList, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set parameters for word cloud
    const fontSizeMultiplier = 10; // Adjust for scaling word sizes
    const xOffset = canvas.width / 2; // Centering x
    const yOffset = canvas.height / 2; // Centering y

    // Draw words on the canvas
    keywordList.forEach(([word, count]) => {
        const fontSize = count * fontSizeMultiplier;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = getRandomColor(); // Random color for each word
        ctx.textAlign = "center";

        // Randomly position words
        const x = xOffset + (Math.random() - 0.5) * (canvas.width - 150); // Random x within the canvas
        const y = yOffset + (Math.random() - 0.5) * (canvas.height - 100); // Random y within the canvas

        // Draw the text
        ctx.fillText(word, x, y);
    });
}

function saveTotalKeywordFrequency() {
    const totalKeywordFrequencyString = JSON.stringify(totalKeywordFrequency);
    localStorage.setItem('totalKeywordFrequency', totalKeywordFrequencyString);
}


// Function to load HTML from another file and extract text
function loadProjectCards() {
    fetch('projectCards.html')  // Load an external HTML file
        .then(response => response.text())
        .then(data => {
            // Extract text from project cards in the loaded HTML
            const projectsData = extractTextFromProjects(data);
            printChartsForProjects(projectsData);  // Do something with the extracted data
            saveTotalKeywordFrequency();
        })
        .catch(error => console.error('Error loading project cards:', error));
}

// Call the function after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    loadProjectCards();
});



//console.log(totalKeywordFrequency); // Test if you want to see the whole list.
