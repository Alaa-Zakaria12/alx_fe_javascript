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
async function createAddQuoteForm() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage
        await postQuoteToServer(newQuote); // Post to server
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

// Function to synchronize local quotes with the server
async function syncQuotes() {
    // Fetch quotes from the server
    await fetchQuotesFromServer();

    // Optionally, you can implement logic to compare local quotes with server quotes 
    // and update the local array accordingly.
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }}

    // Call syncQuotes initially
syncQuotes();

// Call syncQuotes every 5 minutes (300000 milliseconds)
setInterval(syncQuotes, 300000);

    // Call syncQuotes every 5 minutes (300000 milliseconds)
setInterval(syncQuotes, 300000);