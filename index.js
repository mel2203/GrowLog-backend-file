const express = require("express");
//to import our express

const path = require("path");
//built-in node module that builds file paths safely

const app = express();
//store express in app

app.use(express.json());
//lets server read JSON sent in a request body,

require('dotenv').config();
//so that we can use our .env that holds our database

console.log('DATABASE_URL loaded?', !!process.env.DATABASE_URL);

const cors = require('cors');
//Cross-Origin Resource Sharing, to prevent blocked CORS policy
//explanation : makes your Express server add a header to every response that says "other origins may read this."

app.use(cors());
//makes app use cors

const { Pool } = require('pg');
//pg is to the library that lets express read sql (node postgress)
//Pool is a small set of database connections that stay open and get reused.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
//to connect our supabase with our project 

pool.query('SELECT NOW()')
  .then((result) => console.log('Connected to database:', result.rows[0]))
  .catch((err) => console.error('Database connection error:', err));
  //for me to check if my backend is actually connected to the database or not,
  //IM STRESSING IT WONT CONNECT
  //oh. my .env file was not in the same root lmao


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch users" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM categories ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch categories" });
  }
});





//changed hardcoded port of 3000 to what is assigned in railway, 3000 is just fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});