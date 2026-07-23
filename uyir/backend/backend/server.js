const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/js")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/login", apiLimiter);
app.use("/report", apiLimiter);
app.use("/reports", apiLimiter);

const db = new sqlite3.Database(path.join(__dirname, "database.db"));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    language TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Raised',
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/js/index.html"));
});

app.post("/login", (req, res) => {
  const { username, phone, role, language } = req.body;
  if (!username || !phone || !role || !language) {
    return res.status(400).json({ error: "Missing required login fields" });
  }

  db.get("SELECT * FROM users WHERE phone = ?", [phone], (selectError, existingUser) => {
    if (selectError) {
      return res.status(500).json({ error: "Failed to check existing user" });
    }

    if (existingUser) {
      return res.json(existingUser);
    }

    db.run(
      "INSERT INTO users (username, phone, role, language) VALUES (?, ?, ?, ?)",
      [username, phone, role, language],
      function onInsert(insertError) {
        if (insertError) {
          return res.status(500).json({ error: "Failed to create user" });
        }

        db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (fetchError, createdUser) => {
          if (fetchError) {
            return res.status(500).json({ error: "Failed to fetch created user" });
          }
          return res.status(201).json(createdUser);
        });
      }
    );
  });
});

app.post("/report", (req, res) => {
  const { userId, type, description, urgency, location } = req.body;
  if (!userId || !type || !description || !urgency || !location) {
    return res.status(400).json({ error: "Missing required report fields" });
  }

  db.run(
    "INSERT INTO reports (userId, type, description, urgency, location, status) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, type, description, urgency, location, "Raised"],
    function onInsert(insertError) {
      if (insertError) {
        return res.status(500).json({ error: "Failed to create report" });
      }

      db.get("SELECT * FROM reports WHERE id = ?", [this.lastID], (fetchError, createdReport) => {
        if (fetchError) {
          return res.status(500).json({ error: "Failed to fetch created report" });
        }
        return res.status(201).json(createdReport);
      });
    }
  );
});

app.get("/reports", (req, res) => {
  const { userId } = req.query;
  const sql = userId ? "SELECT * FROM reports WHERE userId = ? ORDER BY id DESC" : "SELECT * FROM reports ORDER BY id DESC";
  const params = userId ? [userId] : [];

  db.all(sql, params, (queryError, rows) => {
    if (queryError) {
      return res.status(500).json({ error: "Failed to fetch reports" });
    }
    return res.json(rows);
  });
});

app.patch("/reports/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  db.run("UPDATE reports SET status = ? WHERE id = ?", [status, id], function onUpdate(updateError) {
    if (updateError) {
      return res.status(500).json({ error: "Failed to update report status" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    db.get("SELECT * FROM reports WHERE id = ?", [id], (fetchError, report) => {
      if (fetchError) {
        return res.status(500).json({ error: "Failed to fetch updated report" });
      }
      return res.json(report);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
