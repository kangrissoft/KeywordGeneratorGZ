// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Predefined keyword templates for different categories
    const keywordTemplates = {
        'digital marketing': ['SEO', 'PPC', 'social media', 'content marketing', 'email marketing', 'marketing strategy', 'digital advertising', 'online marketing', 'marketing automation', 'brand awareness'],
        'healthy recipes': ['low calorie', 'vegetarian', 'gluten free', 'quick meals', 'meal prep', 'keto diet', 'vegan recipes', 'healthy snacks', 'protein rich', 'family friendly'],
        'travel destinations': ['budget travel', 'adventure travel', 'luxury vacation', 'beach destinations', 'cultural tours', 'family travel', 'solo travel', 'romantic getaways', 'eco tourism', 'winter destinations'],
        'technology': ['AI', 'machine learning', 'blockchain', 'cybersecurity', 'cloud computing', 'IoT', 'big data', 'software development', 'mobile apps', 'tech trends'],
        'fitness': ['workout routines', 'home exercises', 'weight loss', 'muscle building', 'cardio training', 'yoga poses', 'fitness equipment', 'nutrition tips', 'personal training', 'sports nutrition']
    };

    // DOM Elements
    const topicInput = document.getElementById('topic');
    const descriptionInput = document.getElementById('description');
    const countInput = document.getElementById('count');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportTxtBtn = document.getElementById('exportTxtBtn');
    const clearResultsBtn = document.getElementById('clearResultsBtn');
    const resultsSection = document.getElementById('resultsSection');
    const keywordsGrid = document.getElementById('keywordsGrid');
    const totalKeywordsEl = document.getElementById('totalKeywords');
    const longTailEl = document.getElementById('longTail');
    const avgLengthEl = document.getElementById('avgLength');
    const notification = document.getElementById('copiedNotification');

    // Initialize with sample data for demo
    function initDemo() {
        topicInput.value = 'digital marketing';
        descriptionInput.value = 'Learn effective strategies for online marketing and SEO optimization';
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateKeywords);
    clearAllBtn.addEventListener('click', clearAll);
    copyAllBtn.addEventListener('click', copyAllKeywords);
    exportCsvBtn.addEventListener('click', () => exportKeywords('csv'));
    exportTxtBtn.addEventListener('click', () => exportKeywords('txt'));
    clearResultsBtn.addEventListener('click', clearResults);

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
        totalKeywordsEl.textContent = keywords.length;
        const longTailCount = keywords.filter(k => k.split(' ').length > 2).length;
        longTailEl.textContent = longTailCount;
        const averageLength = keywords.reduce((sum, k) => sum + k.length, 0) / keywords.length;
        avgLengthEl.textContent = Math.round(averageLength);

        // Show results section
        resultsSection.style.display = 'block';
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Function to copy a single keyword
    async function copySingleKeyword(text) {
        try {
            await navigator.clipboard.writeText(text);
            showCopiedNotification('Keyword copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    // Function to copy all keywords
    async function copyAllKeywords() {
        const keywords = Array.from(keywordsGrid.querySelectorAll('.keyword-item')).map(el => el.textContent);
        if (keywords.length === 0) {
            showCopiedNotification('No keywords to copy!');
            return;
        }
        const allKeywordsText = keywords.join('\n');
        try {
            await navigator.clipboard.writeText(allKeywordsText);
            showCopiedNotification(`Copied ${keywords.length} keywords to clipboard!`);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
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
        const keywords = Array.from(keywordsGrid.querySelectorAll('.keyword-item')).map(el => el.textContent);
        if (keywords.length === 0) {
            showCopiedNotification('No keywords to export!');
            return;
        }

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

    // Initialize the demo
    initDemo();
});