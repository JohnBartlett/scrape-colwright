# scrape-colwright

Inventory scraper and browser-based gallery for ColWright.com.

---

## Features

- Scrapes inventory items—including images—from ColWright inventory pages using Puppeteer.
- Saves data to a local SQLite3 database and downloads images.
- Modern HTML gallery (`index.html`) with instant search/filter for all inventory.
- Inventory review workflow UI (`review.html`), including search/jump and save/comment features.
- Ready to deploy the frontend to Vercel as a static site with pretty URLs.

---

## Requirements

- Node.js v18+ recommended (minimum v14).
- npm (comes with most Node.js installs).

---

## Setup

Clone the repository
git clone https://github.com/JohnBartlett/scrape-colwright.git
cd scrape-colwright

Install all required dependencies
npm install

text

---

## Usage

### Scrape inventory (and download images):

Edit your credentials in `scraper.js` (or set as environment variables: `EMAIL`, `PASSWORD`):

node scraper.js

text

- Images will be saved to the `images/` directory.
- Data will be stored in `inventory.db` (SQLite3).

---

### Run the Frontend (Gallery and Review UIs):

- Open `index.html` in your browser for the gallery view with live search.
- Open `review.html` for the review/jump workflow.
- For local testing you can use [VSCode Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or:
python3 -m http.server

text
and then navigate to `http://localhost:8000`

---

### Deploy the Frontend to Vercel

1. Push your repo to GitHub.
2. [Import your repo to Vercel](https://vercel.com/).
3. *(Optional)* For pretty URLs, use this `vercel.json`:
{
"rewrites": [
{ "source": "/review", "destination": "/review.html" }
]
}

text
Place this file at your project root before deploy.

---

## Configuration

- Change items per page or page start for scraping in `scraper.js`.
- API endpoints (for data or comments) are handled by your custom backend (if deployed).

---

## Important Notes

- **DO NOT deploy Puppeteer/scraper.js on Vercel**; run scraping locally or on a suitable VPS.
- SQLite is not persistent on Vercel—use only for local processing/storage.

---

## License

MIT

---

## Repository

[https://github.com/JohnBartlett/scrape-colwright](https://github.com/JohnBartlett/scrape-colwright)