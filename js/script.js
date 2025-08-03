// Predefined keyword templates for different categories
const keywordTemplates = {
    'digital marketing': ['SEO', 'PPC', 'social media', 'content marketing', 'email marketing', 'marketing strategy', 'digital advertising', 'online marketing', 'marketing automation', 'brand awareness'],
    'healthy recipes': ['low calorie', 'vegetarian', 'gluten free', 'quick meals', 'meal prep', 'keto diet', 'vegan recipes', 'healthy snacks', 'protein rich', 'family friendly'],
    'travel destinations': ['budget travel', 'adventure travel', 'luxury vacation', 'beach destinations', 'cultural tours', 'family travel', 'solo travel', 'romantic getaways', 'eco tourism', 'winter destinations'],
    'technology': ['AI', 'machine learning', 'blockchain', 'cybersecurity', 'cloud computing', 'IoT', 'big data', 'software development', 'mobile apps', 'tech trends'],
    'fitness': ['workout routines', 'home exercises', 'weight loss', 'muscle building', 'cardio training', 'yoga poses', 'fitness equipment', 'nutrition tips', 'personal training', 'sports nutrition']
};

// DOM Elements
let topicInput, descriptionInput, countInput, generateBtn, clearAllBtn, copyAllBtn, exportCsvBtn, exportTxtBtn, clearResultsBtn;
let resultsSection, keywordsGrid, totalKeywords, longTail, avgLength, notification;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {

    // Get DOM elements
    topicInput = document.getElementById('topic');
    descriptionInput = document.getElementById('description');
    countInput = document.getElementById('count');
    generateBtn = document.getElementById('generateBtn');
    clearAllBtn = document.getElementById('clearAllBtn');
    copyAllBtn = document.getElementById('copyAllBtn');
    exportCsvBtn = document.getElementById('exportCsvBtn');
    exportTxtBtn = document.getElementById('exportTxtBtn');
    clearResultsBtn = document.getElementById('clearResultsBtn');
    resultsSection = document.getElementById('resultsSection');
    keywordsGrid = document.getElementById('keywordsGrid');
    totalKeywords = document.getElementById('totalKeywords');
    longTail = document.getElementById('longTail');
    avgLength = document.getElementById('avgLength');
    notification = document.getElementById('copiedNotification');

    // Add event listeners
    generateBtn.addEventListener('click', generateKeywords);
    clearAllBtn.addEventListener('click', clearAll);
    copyAllBtn.addEventListener('click', copyAllKeywords);
    exportCsvBtn.addEventListener('click', () => exportKeywords('csv'));
    exportTxtBtn.addEventListener('click', () => exportKeywords('txt'));
    clearResultsBtn.addEventListener('click', clearResults);

    // Initialize with sample data for demo
    initDemo();
});

// Initialize with sample data for demo
function initDemo() {
    topicInput.value = 'digital marketing';
    descriptionInput.value = 'Learn effective strategies for online marketing and SEO optimization';
}

// Function to generate keywords based on topic
function generateKeywords() {
    const topic = topicInput.value.trim();
    const description = descriptionInput.value.trim();
    const count = parseInt(countInput.value);

    if (!topic) {
        alert('Please enter a topic');
        return;
    }

    // Get base keywords
    let baseKeywords = [];
    const lowerTopic = topic.toLowerCase();
    // Check if we have templates for this topic
    for (const [key, keywords] of Object.entries(keywordTemplates)) {
        if (lowerTopic.includes(key)) {
            baseKeywords = [...keywords];
            break;
        }
    }
    // If no specific template, generate generic keywords
    if (baseKeywords.length === 0) {
        baseKeywords = ['best', 'top', 'guide', 'tips', 'review', 'how to', 'what is', 'benefits of', 'vs', 'comparison'];
    }

    // Generate keyword combinations
    const keywords = new Set();
    // Add the main topic
    keywords.add(topic);
    // Generate variations
    baseKeywords.forEach(keyword => {
        keywords.add(`${topic} ${keyword}`);
        keywords.add(`${keyword} ${topic}`);
        keywords.add(`${topic} for ${keyword}`);
    });
    // Add long-tail keywords based on description
    if (description) {
        const descWords = description.split(' ').filter(word => word.length > 3);
        if (descWords.length > 0) {
            const sampleWords = descWords.slice(0, 3);
            sampleWords.forEach(word => {
                keywords.add(`${topic} ${word}`);
                baseKeywords.forEach(kw => {
                    keywords.add(`${topic} ${kw} ${word}`);
                });
            });
        }
    }

    // Convert to array and limit to requested count
    let keywordArray = Array.from(keywords);
    if (keywordArray.length > count) {
        // Shuffle and take only the requested number
        keywordArray = shuffleArray(keywordArray).slice(0, count);
    }

    // Display results
    displayKeywords(keywordArray);
}

// Function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Function to display keywords
function displayKeywords(keywords) {
    // Clear previous results
    keywordsGrid.innerHTML = '';

    // Add keywords to grid
    keywords.forEach(keyword => {
        const keywordElement = document.createElement('div');
        keywordElement.className = 'keyword-item';
        keywordElement.textContent = keyword;
        keywordElement.addEventListener('click', () => copySingleKeyword(keyword));
        keywordsGrid.appendChild(keywordElement);
    });

    // Update statistics
    totalKeywords.textContent = keywords.length;
    const longTailCount = keywords.filter(k => k.split(' ').length > 2).length;
    longTail.textContent = longTailCount;
    const averageLength = keywords.reduce((sum, k) => sum + k.length, 0) / keywords.length;
    avgLength.textContent = Math.round(averageLength);

    // Show results section
    resultsSection.style.display = 'block';
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to copy a single keyword
function copySingleKeyword(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopiedNotification('Keyword copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Function to copy all keywords
function copyAllKeywords() {
    const keywordElements = document.querySelectorAll('.keyword-item');
    if (keywordElements.length === 0) {
        showCopiedNotification('No keywords to copy!');
        return;
    }
    const keywords = Array.from(keywordElements).map(el => el.textContent);
    const allKeywordsText = keywords.join('\n');
    navigator.clipboard.writeText(allKeywordsText).then(() => {
        showCopiedNotification(`Copied ${keywords.length} keywords to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy all keywords: ', err);
    });
}

// Function to show copied notification
function showCopiedNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to export keywords
function exportKeywords(format) {
    const keywordElements = document.querySelectorAll('.keyword-item');
    if (keywordElements.length === 0) {
        showCopiedNotification('No keywords to export!');
        return;
    }
    const keywords = Array.from(keywordElements).map(el => el.textContent);

    let content, filename, mimeType;
    if (format === 'csv') {
        content = 'Keyword\n' + keywords.join('\n');
        filename = 'keywords.csv';
        mimeType = 'text/csv';
    } else {
        content = keywords.join('\n');
        filename = 'keywords.txt';
        mimeType = 'text/plain';
    }

    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showCopiedNotification(`Exported ${keywords.length} keywords as ${format.toUpperCase()}!`);
}

// Function to clear all inputs
function clearAll() {
    topicInput.value = '';
    descriptionInput.value = '';
    countInput.value = '20';
    clearResults();
}

// Function to clear results
function clearResults() {
    resultsSection.style.display = 'none';
}