import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "axes.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS axes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bullets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      axe_id INTEGER NOT NULL REFERENCES axes(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      axe_id INTEGER NOT NULL REFERENCES axes(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
}

export interface AxeRow {
  id: number;
  slug: string;
  created_at: string;
  bullets: string[];
  links: { url: string; label: string }[];
}

export function createAxe(
  slug: string,
  bullets: string[],
  links: { url: string; label: string }[]
): AxeRow {
  const db = getDb();

  const insert = db.transaction(() => {
    const axeResult = db
      .prepare("INSERT INTO axes (slug) VALUES (?)")
      .run(slug);
    const axeId = axeResult.lastInsertRowid as number;

    for (let i = 0; i < bullets.length; i++) {
      db.prepare(
        "INSERT INTO bullets (axe_id, content, sort_order) VALUES (?, ?, ?)"
      ).run(axeId, bullets[i], i);
    }

    for (let i = 0; i < links.length; i++) {
      db.prepare(
        "INSERT INTO links (axe_id, url, label, sort_order) VALUES (?, ?, ?, ?)"
      ).run(axeId, links[i].url, links[i].label, i);
    }

    return axeId;
  });

  const axeId = insert() as number;
  return getAxeById(axeId)!;
}

export function getAxeById(id: number): AxeRow | null {
  const db = getDb();
  const axe = db.prepare("SELECT * FROM axes WHERE id = ?").get(id) as
    | { id: number; slug: string; created_at: string }
    | undefined;
  if (!axe) return null;
  return hydrateAxe(axe);
}

export function getRandomAxes(count: number): AxeRow[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM axes ORDER BY RANDOM() LIMIT ?")
    .all(count) as { id: number; slug: string; created_at: string }[];
  return rows.map(hydrateAxe);
}

export function getAllAxes(): AxeRow[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM axes ORDER BY created_at DESC")
    .all() as { id: number; slug: string; created_at: string }[];
  return rows.map(hydrateAxe);
}

export function deleteAxe(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM axes WHERE id = ?").run(id);
  return result.changes > 0;
}

function hydrateAxe(axe: {
  id: number;
  slug: string;
  created_at: string;
}): AxeRow {
  const db = getDb();

  const bullets = (
    db
      .prepare(
        "SELECT content FROM bullets WHERE axe_id = ? ORDER BY sort_order"
      )
      .all(axe.id) as { content: string }[]
  ).map((b) => b.content);

  const links = db
    .prepare(
      "SELECT url, label FROM links WHERE axe_id = ? ORDER BY sort_order"
    )
    .all(axe.id) as { url: string; label: string }[];

  return { ...axe, bullets, links };
}
