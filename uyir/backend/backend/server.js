const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Create DB
const db = new sqlite3.Database("./database.db");

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    phone TEXT,
    role TEXT,
    language TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    type TEXT,
    description TEXT,
    urgency TEXT,
    location TEXT,
    status TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
});

// Routes
app.post("/login", (req, res) => {
  const { username, phone, role, language } = req.body;
  db.get("SELECT * FROM users WHERE phone=?", [phone], (err, row) => {
    if (row) {
      res.json(row);
    } else {
      db.run(
        "INSERT INTO users (username, phone, role, language) VALUES (?, ?, ?, ?)",
        [username, phone, role, language],
        function () {
          db.get("SELECT * FROM users WHERE id=?", [this.lastID], (err, row) => {
            res.json(row);
          });
        }
      );
    }
  });
});

app.post("/report", (req, res) => {
  const { userId, type, description, urgency, location } = req.body;
  db.run(
    "INSERT INTO reports (userId, type, description, urgency, location, status) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, type, description, urgency, location, "Raised"],
    function () {
      db.get("SELECT * FROM reports WHERE id=?", [this.lastID], (err, row) => {
        res.json(row);
      });
    }
  );
});

app.get("/reports", (req, res) => {
  db.all("SELECT * FROM reports", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
