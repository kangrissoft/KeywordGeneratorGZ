class KeywordGenerator {
    constructor() {
        this.keywordTemplates = {
            'digital marketing': ['SEO', 'PPC', 'social media', 'content marketing', 'email marketing', 'marketing strategy', 'digital advertising', 'online marketing', 'marketing automation', 'brand awareness'],
            'healthy recipes': ['low calorie', 'vegetarian', 'gluten free', 'quick meals', 'meal prep', 'keto diet', 'vegan recipes', 'healthy snacks', 'protein rich', 'family friendly'],
            'travel destinations': ['budget travel', 'adventure travel', 'luxury vacation', 'beach destinations', 'cultural tours', 'family travel', 'solo travel', 'romantic getaways', 'eco tourism', 'winter destinations'],
            'technology': ['AI', 'machine learning', 'blockchain', 'cybersecurity', 'cloud computing', 'IoT', 'big data', 'software development', 'mobile apps', 'tech trends'],
            'fitness': ['workout routines', 'home exercises', 'weight loss', 'muscle building', 'cardio training', 'yoga poses', 'fitness equipment', 'nutrition tips', 'personal training', 'sports nutrition']
        };

        this.initElements();
        this.initEventListeners();
        this.initDemo();
    }

    initElements() {
        this.topicInput = document.getElementById('topic');
        this.descriptionInput = document.getElementById('description');
        this.countInput = document.getElementById('count');
        this.generateBtn = document.getElementById('generateBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.exportCsvBtn = document.getElementById('exportCsvBtn');
        this.exportTxtBtn = document.getElementById('exportTxtBtn');
        this.clearResultsBtn = document.getElementById('clearResultsBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.keywordsGrid = document.getElementById('keywordsGrid');
        this.totalKeywordsEl = document.getElementById('totalKeywords');
        this.longTailEl = document.getElementById('longTail');
        this.avgLengthEl = document.getElementById('avgLength');
        this.notification = document.getElementById('copiedNotification');
    }

    initEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateKeywords());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.copyAllBtn.addEventListener('click', () => this.copyAllKeywords());
        this.exportCsvBtn.addEventListener('click', () => this.exportKeywords('csv'));
        this.exportTxtBtn.addEventListener('click', () => this.exportKeywords('txt'));
        this.clearResultsBtn.addEventListener('click', () => this.clearResults());
    }

    initDemo() {
        this.topicInput.value = 'digital marketing';
        this.descriptionInput.value = 'Learn effective strategies for online marketing and SEO optimization';
    }

    generateKeywords() {
        const topic = this.topicInput.value.trim();
        const description = this.descriptionInput.value.trim();
        const count = parseInt(this.countInput.value);

        if (!topic) {
            alert('Please enter a topic');
            return;
        }

        let baseKeywords = this.getBaseKeywords(topic);
        const keywords = this.generateKeywordSet(topic, baseKeywords, description, count);
        this.displayKeywords(Array.from(keywords));
    }

    getBaseKeywords(topic) {
        const lowerTopic = topic.toLowerCase();
        for (const [key, keywords] of Object.entries(this.keywordTemplates)) {
            if (lowerTopic.includes(key)) {
                return [...keywords];
            }
        }
        return ['best', 'top', 'guide', 'tips', 'review', 'how to', 'what is', 'benefits of', 'vs', 'comparison'];
    }

    generateKeywordSet(topic, baseKeywords, description, count) {
        const keywords = new Set();
        keywords.add(topic);

        baseKeywords.forEach(keyword => {
            keywords.add(`${topic} ${keyword}`);
            keywords.add(`${keyword} ${topic}`);
            keywords.add(`${topic} for ${keyword}`);
        });

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

        let keywordArray = Array.from(keywords);
        if (keywordArray.length > count) {
            keywordArray = this.shuffleArray(keywordArray).slice(0, count);
        }

        return new Set(keywordArray);
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    displayKeywords(keywords) {
        this.keywordsGrid.innerHTML = '';

        keywords.forEach(keyword => {
            const keywordElement = document.createElement('div');
            keywordElement.className = 'keyword-item';
            keywordElement.textContent = keyword;
            keywordElement.addEventListener('click', () => this.copySingleKeyword(keyword));
            this.keywordsGrid.appendChild(keywordElement);
        });

        this.updateStatistics(keywords);
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateStatistics(keywords) {
        this.totalKeywordsEl.textContent = keywords.length;
        const longTailCount = keywords.filter(k => k.split(' ').length > 2).length;
        this.longTailEl.textContent = longTailCount;
        const averageLength = keywords.reduce((sum, k) => sum + k.length, 0) / keywords.length;
        this.avgLengthEl.textContent = Math.round(averageLength);
    }

    async copySingleKeyword(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopiedNotification('Keyword copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    async copyAllKeywords() {
        const keywords = Array.from(this.keywordsGrid.querySelectorAll('.keyword-item')).map(el => el.textContent);
        if (keywords.length === 0) {
            this.showCopiedNotification('No keywords to copy!');
            return;
        }

        const allKeywordsText = keywords.join('\n');
        try {
            await navigator.clipboard.writeText(allKeywordsText);
            this.showCopiedNotification(`Copied ${keywords.length} keywords to clipboard!`);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    showCopiedNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    exportKeywords(format) {
        const keywords = Array.from(this.keywordsGrid.querySelectorAll('.keyword-item')).map(el => el.textContent);
        if (keywords.length === 0) {
            this.showCopiedNotification('No keywords to export!');
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

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showCopiedNotification(`Exported ${keywords.length} keywords as ${format.toUpperCase()}!`);
    }

    clearAll() {
        this.topicInput.value = '';
        this.descriptionInput.value = '';
        this.countInput.value = '20';
        this.clearResults();
    }

    clearResults() {
        this.resultsSection.style.display = 'none';
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new KeywordGenerator();
});