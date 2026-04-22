# Axe Grinder

A tool for building, storing, and randomly retrieving talking points called **axes**. Each axe has three components:

- **Slug** — the core headline or talking point
- **Bullets** — supporting points that back up the slug
- **Links** — URLs to backup data, articles, or evidence

---

## Getting Started

### Prerequisites

- Node.js 18+

### Install and run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

The SQLite database is created automatically at `data/axes.db` on first run — no setup needed.

---

## Using the App

### Upload Axe

Use this tab to add a new axe to your collection.

1. Enter a **slug** — this is the headline or core message (required).
2. Add one or more **bullets** — click "+ Add bullet" to add more rows, and × to remove any.
3. Add one or more **links** — each link has a short label and a URL. Click "+ Add link" to add more rows.
4. Click **Save Axe**.

### Random Draw

Use this tab to pull a random selection of axes from your collection.

1. Set the **number of axes** you want to draw (1–100).
2. Click **Draw Axes**.

Each result card shows the slug, its bullets, and clickable links to the backup data. Click the button again to get a fresh random set.

### All Axes

Use this tab to browse your full collection.

- Click any row to expand it and see its bullets and links.
- Click the trash icon on any row to delete that axe.
- Click **Refresh** to reload the list.

---

## API

The app exposes a simple REST API if you want to interact with it programmatically.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/axes` | Create a new axe |
| `GET` | `/api/axes` | List all axes (newest first) |
| `GET` | `/api/axes/random?count=N` | Draw N random axes |
| `GET` | `/api/axes/:id` | Fetch a single axe by ID |
| `DELETE` | `/api/axes/:id` | Delete an axe |

**Example — create an axe:**

```bash
curl -X POST http://localhost:3000/api/axes \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "Our product ships 3x faster than competitors",
    "bullets": [
      "Average deploy time is 4 minutes vs. 12 minutes industry average",
      "CI pipeline runs in parallel across 8 workers"
    ],
    "links": [
      { "label": "Benchmark report", "url": "https://example.com/report" }
    ]
  }'
```

**Example — draw 5 random axes:**

```bash
curl http://localhost:3000/api/axes/random?count=5
```
