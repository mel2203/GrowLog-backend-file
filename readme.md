# 🌿 GrowLog API
**The plant care API behind GrowLog.** 🌱
Store plants, gardeners and categories in a database, and fetch or add them with simple requests.

Hosted on Railway, but built in Supabase. (boom boom boom)
built with Express.js and PostgreSQL. The frontend lives in its own repo. 

## 🔗 Links
 
| | |
|---|---|
| ⚙️ Live API | growlog-backend-file-production.up.railway.app |
| 🌍 Live site | https://growlog-xi.vercel.app/ |
| 🖥️ Frontend repo | https://github.com/mel2203/GrowLog-frontend-file |
 
Open the live API address in your browser to see the endpoint list.

## ✨ Features
 
- 🪴 Get all plants, or one plant by id
- ➕ Add plants and gardeners
- 🗂️ Each plant belongs to an author and a category


## 🛠️ Built with
 
Node.js · Express.js · Lyana's Tears · PostgreSQL (Supabase) · deployed on Railway


## 📡 Endpoints
 
| Method | Route | What it does |
|---|---|---|
| GET | `/plants` | Get all plants (with author and category names) |
| GET | `/plants/:id` | Get one plant |
| POST | `/plants` | Add a plant |
| GET | `/users` | Get all gardeners |
| POST | `/users` | Add a gardener |
| GET | `/categories` | Get all categories |
 
**Example: `GET /plants`**


Made with 💚 for the Sigma School Mission 8 project.
