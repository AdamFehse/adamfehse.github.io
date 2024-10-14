// Function to extract title, description, and text content from each project card
function extractTextFromProjects() {
    const projectCards = document.querySelectorAll('.card');
    let projectsData = [];

    projectCards.forEach(card => {
        const title = card.querySelector('.card-title').innerText.trim();
        const description = card.querySelector('.card-text').innerText.trim();
        const fullText = title + ' ' + description;

        // Store each project with its title and text content
        projectsData.push({ title, fullText });
    });

    return projectsData;
}

// Function to clean text, remove common stopwords, and generate a keyword list
function generateKeywordList(text) {
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanedText.split(/\s+/);

    const stopwords = ['the', 'and', 'in', 'of', 'to', 'a', 'with', 'for', 'on', 'is', 'by', 'an', 'it', 'as',
        'are'
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

// Function to create a bar chart using Chart.js
function createBarChart(projectTitle, keywordList, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = keywordList.map(([word]) => word);
    const data = keywordList.map(([, count]) => count);

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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate and display charts for each project
function printChartsForProjects(projectsData) {
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = ''; // Clear any existing charts

    projectsData.forEach((project, index) => {
        const keywordList = generateKeywordList(project.fullText);

        // Create a canvas for each project chart
        const canvasId = `chart-${index}`;
        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        chartsContainer.appendChild(canvas);

        // Generate a chart for the project
        createBarChart(project.title, keywordList, canvasId);
    });
}

// After DOM is loaded, extract text, generate keyword list, and display charts
document.addEventListener('DOMContentLoaded', () => {
    const projectsData = extractTextFromProjects();
    printChartsForProjects(projectsData);
});
