document.addEventListener('DOMContentLoaded', () => {
    const bookSearch = new BookSearch();
    const summarizer = new Summarizer();

    // DOM Elements
    const searchInput = document.getElementById('bookSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchDropdown = document.getElementById('searchDropdown');
    const selectedBook = document.getElementById('selectedBook');
    const bookDetails = document.getElementById('bookDetails');
    const pageNumber = document.getElementById('pageNumber');
    const generateBtn = document.getElementById('generateBtn');
    const summary = document.getElementById('summary');
    const summaryContent = document.getElementById('summaryContent');
    const loading = document.getElementById('loading');

    let currentBook = null;
    let searchTimeout = null;

    // Search input handler with debounce
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim();
        
        if (!query) {
            searchDropdown.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(async () => {
            const books = await bookSearch.searchBooks(query);
            displaySearchDropdown(books);
        }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.add('hidden');
        }
    });

    // Display search dropdown
    function displaySearchDropdown(books) {
        searchDropdown.innerHTML = '';
        
        if (books.length === 0) {
            searchDropdown.classList.add('hidden');
            return;
        }

        books.forEach(book => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.innerHTML = `
                <img src="${book.thumbnail}" alt="${book.title}">
                <div>
                    <div><strong>${book.title}</strong></div>
                    <div>${book.authors.join(', ')}</div>
                </div>
            `;

            div.addEventListener('click', () => {
                searchInput.value = book.title;
                searchDropdown.classList.add('hidden');
                selectBook(book);
            });

            searchDropdown.appendChild(div);
        });

        searchDropdown.classList.remove('hidden');
    }

    // Select book handler
    function selectBook(book) {
        currentBook = book;
        selectedBook.classList.remove('hidden');
        summary.classList.add('hidden');
        
        bookDetails.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>By ${book.authors.join(', ')}</p>
            <p>Total Pages: ${book.pageCount}</p>
            <p>${book.description}</p>
        `;
    }

    // Generate summary button click handler
    generateBtn.addEventListener('click', async () => {
        if (!currentBook || !pageNumber.value) return;

        const pages = parseInt(pageNumber.value);
        if (pages > currentBook.pageCount) {
            alert('Page number cannot exceed total pages');
            return;
        }

        loading.classList.remove('hidden');
        summary.classList.add('hidden');

        try {
            const summaryText = await summarizer.generateSummary(currentBook, pages);
            summaryContent.textContent = summaryText;
            summary.classList.remove('hidden');
        } catch (error) {
            alert('Failed to generate summary. Please try again.');
        } finally {
            loading.classList.add('hidden');
        }
    });
}); 