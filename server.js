// server.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = "bookbuddy";
let db;

// Connect to MongoDB
MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error(error));

// CRUD Routes
app.get("/books", async (req, res) => {
  try {
    const books = await db.collection("books").find().toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", err });
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = req.body;
    const result = await db.collection("books").insertOne(book);
    res.status(201).json({ message: "Book added", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: "Error adding book", err });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = req.body;
    delete updatedBook._id;
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBook }
    );
    res.status(200).json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating book", err });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("books").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book", err });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
