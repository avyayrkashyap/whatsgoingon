class BookSearch {
    constructor() {
        this.GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
    }

    async searchBooks(query) {
        try {
            const response = await fetch(`${this.GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return this.processBookResults(data.items || []);
        } catch (error) {
            console.error('Error searching books:', error);
            return [];
        }
    }

    processBookResults(books) {
        return books.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['Unknown Author'],
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || 'placeholder-image.jpg',
            pageCount: book.volumeInfo.pageCount || 0,
            description: book.volumeInfo.description || 'No description available'
        }));
    }
} 