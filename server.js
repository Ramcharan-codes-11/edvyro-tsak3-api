const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("internships.db");

app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    mode TEXT NOT NULL,
    duration_weeks INTEGER NOT NULL,
    applications_open INTEGER NOT NULL DEFAULT 1
  )
`);

const total = db.prepare(
  "SELECT COUNT(*) AS count FROM internships"
).get().count;

if (total === 0) {
  const add = db.prepare(`
    INSERT INTO internships
    (title, domain, mode, duration_weeks, applications_open)
    VALUES (?, ?, ?, ?, ?)
  `);

  add.run("Frontend Intern", "Web Development", "Remote", 4, 1);
  add.run("Data Analytics Intern", "Data Analytics", "Remote", 6, 1);
  add.run("UI/UX Intern", "Design", "Hybrid", 4, 1);
}

app.get("/api/internships", (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  const data = db.prepare(
    "SELECT * FROM internships LIMIT ? OFFSET ?"
  ).all(limit, offset);

  const count = db.prepare(
    "SELECT COUNT(*) AS count FROM internships"
  ).get().count;

  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
});

app.get("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const item = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(id);

  if (!item) {
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json({ success: true, data: item });
});

app.post("/api/internships", (req, res) => {
  const { title, domain, mode, duration_weeks } = req.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof domain !== "string" || !domain.trim() ||
    typeof mode !== "string" || !mode.trim() ||
    !Number.isInteger(duration_weeks) || duration_weeks < 1
  ) {
    return res.status(400).json({ error: "Invalid internship details" });
  }

  const result = db.prepare(`
    INSERT INTO internships (title, domain, mode, duration_weeks)
    VALUES (?, ?, ?, ?)
  `).run(title.trim(), domain.trim(), mode.trim(), duration_weeks);

  const item = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(result.lastInsertRowid);

  res.status(201).json({ success: true, data: item });
});

app.put("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, domain, mode, duration_weeks } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (
    typeof title !== "string" || !title.trim() ||
    typeof domain !== "string" || !domain.trim() ||
    typeof mode !== "string" || !mode.trim() ||
    !Number.isInteger(duration_weeks) || duration_weeks < 1
  ) {
    return res.status(400).json({ error: "Invalid internship details" });
  }

  const result = db.prepare(`
    UPDATE internships
    SET title = ?, domain = ?, mode = ?, duration_weeks = ?
    WHERE id = ?
  `).run(title.trim(), domain.trim(), mode.trim(), duration_weeks, id);

  if (!result.changes) {
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json({ success: true, message: "Internship updated" });
});

app.delete("/api/internships/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const result = db.prepare(
    "DELETE FROM internships WHERE id = ?"
  ).run(id);

  if (!result.changes) {
    return res.status(404).json({ error: "Internship not found" });
  }

  res.json({ success: true, message: "Internship deleted" });
});

app.listen(3000, () => {
  console.log("Internship API running at http://localhost:3000");
});