const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();
const fs = require("fs");
const { readFile, writeFile } = fs.promises;
const path = require("path");
const api = require("./routes/notes");
const { AsyncLocalStorage } = require("async_hooks");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", async (req, res) => {
  const dbText = await readFile("db/db.json");
  const db = JSON.parse(dbText);
  res.json(db);
});

app.post("/api/notes", async (req, res) => {
  const note = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };
  const dbText = await readFile("db/db.json");
  const db = JSON.parse(dbText);
  db.push(note);
  const dbData = await writeFile("db/db.json", JSON.stringify(db));

  res.json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  const dbText = await readFile("db/db.json");
  const db = JSON.parse(dbText);
  const { id } = req.params;
  const deleted = db.find((db) => db.id === id);
  if (deleted) {
    db = db.filter((db) => db.id != id);
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
