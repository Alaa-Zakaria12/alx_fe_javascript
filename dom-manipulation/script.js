let quotes = []; // Array to hold quote objects
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Function to show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerText = quotes[randomIndex].text;
    } else {
        quoteDisplay.innerText = 'No quotes available.';
    }
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Save to local storage
        populateCategories(); // Update category dropdown
        showRandomQuote(); // Display new quote
        clearAddQuoteForm(); // Clear input fields
    }
}

// Function to clear the add quote form
function clearAddQuoteForm() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}

// Function to populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = filteredQuotes.length ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available.';
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
    if (storedQuotes) {
        quotes = storedQuotes;
        populateCategories();
        showRandomQuote();
    }
}

// Function to export quotes as JSON
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const fetchedQuotes = data.map(item => ({
            text: item.title, // Example: using title as the quote text
            category: 'fetched' // Example category
        }));
        quotes.push(...fetchedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Function to sync quotes with the server
async function syncQuotes() {
    await fetchQuotesFromServer(); // Fetch new quotes from server
}

// Function to periodically check for new quotes from the server
function startQuoteSyncInterval() {
    setInterval(syncQuotes, 60000); // Check every 60 seconds
}

// Event listeners
document.getElementById('addQuoteButton').addEventListener('click', addQuote); // Add quote button
document.getElementById('showNew')