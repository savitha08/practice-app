import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const app = express();


app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "database.db");
// const dbPath = path.join(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

app.get("/", (req, res) => {
  res.json("Backend is running");
});

app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";

  db.all(q, [], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch users",
        error: err.message
      });
    }

    return res.json(data);
  });
});

app.post("/users", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email and password are required"
    });
  }

  const q = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `;

  db.run(q, [username, email, password], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Failed to insert user",
        error: err.message
      });
    }

    return res.status(201).json({
      id: this.lastID,
      username,
      email,
      password
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const q = "DELETE FROM users WHERE id = ?";

  db.run(q, [id], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete user",
        error: err.message
      });
    }

    return res.json({
      message: "User deleted successfully"
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});