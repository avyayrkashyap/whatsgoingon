class Summarizer {
    constructor() {
        // Replace with your Cloudflare Worker URL
        this.PROXY_URL = 'https://whatsgoingon.avyayrk.workers.dev/summarize';
    }

    async generateSummary(bookDetails, pageNumber) {
        try {
            const response = await fetch(this.PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book: bookDetails,
                    pageNumber: pageNumber
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate summary');
            }

            const data = await response.json();
            return data.summary;
        } catch (error) {
            console.error('Error generating summary:', error);
            throw error;
        }
    }
} 