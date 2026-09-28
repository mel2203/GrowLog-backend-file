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


//for users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch users" });
  }
});

//fetch users by their id number
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "User id must be a number" });
    }

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch user" });
  }
});

//for categories
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM categories ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch categories" });
  }
});

//fetch category by their id number
app.get("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Category id must be a number" });
    }

    const result = await pool.query(
      "SELECT id, name FROM categories WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch category" });
  }
});

//for posting new USERS (add to query)
app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: "username is required" });
    }

    const result = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING id, username",
      [username.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That username is already taken" });
    }
    console.error(err.message);
    res.status(500).json({ error: "Could not create user" });
  }
});


//For posting NEW plants
app.post("/plants", async (req, res) => {
  try {
    const { name, care_needs, instructions, author_id, category_id } = req.body;

    if (!name || !care_needs || !instructions || !author_id || !category_id) {
      return res.status(400).json({
        error: "name, care_needs, instructions, author_id and category_id are all required",
      });
    }

    const result = await pool.query(
      `INSERT INTO plants (name, care_needs, instructions, author_id, category_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, care_needs, instructions, author_id, category_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({ error: "author_id or category_id does not exist" });
    }
    console.error(err.message);
    res.status(500).json({ error: "Could not create plant" });
  }
});

//to get all the plants
app.get("/plants", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT plants.id, plants.name, plants.care_needs, plants.instructions,
             users.username AS author, categories.name AS category
      FROM plants
      JOIN users ON plants.author_id = users.id
      JOIN categories ON plants.category_id = categories.id
      ORDER BY plants.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch plants" });
  }
});

//get the plants by their specific id
app.get("/plants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT plants.id, plants.name, plants.care_needs, plants.instructions,
              users.username AS author, categories.name AS category
       FROM plants
       JOIN users ON plants.author_id = users.id
       JOIN categories ON plants.category_id = categories.id
       WHERE plants.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch plant" });
  }
});



//changed hardcoded port of 3000 to what is assigned in railway, 3000 is just fallback
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});