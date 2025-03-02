const express = require("express");
let books = require("./booksdb.js");
let { users, isValid } = require("./auth_users.js");
const { default: axios } = require("axios");

const public_users = express.Router();

const normalizeStrings = (string) => string.toLowerCase().trim();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Handle new user registration
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res
      .status(404)
      .json({ message: "paswword and username are required" });
  }
});

public_users.get("/books", (req, res) => {
  return res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const booksData = await axios.get("http://localhost:3000/books");
    return res.status(200).send(booksData.data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  try {
    const booksData = await axios.get("http://localhost:3000/books");
    const book = booksData.data?.[isbn];

    if (book) {
      return res.status(300).send(book);
    } else {
      return res.status(404).json({ message: "Could not find the book" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  if (!author) {
    return res.status(400).json({ message: "Author is required" });
  }

  try {
    const booksData = await axios.get("http://localhost:3000/books");
    const booksArray = Object.values(booksData.data);

    const filteredBooks = booksArray.filter(
      (book) => normalizeStrings(book.author) === normalizeStrings(author)
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "Could not find books by this author" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const booksData = await axios.get("http://localhost:3000/books");
    const booksArray = Object.values(booksData.data);

    const filteredBooks = booksArray.filter(
      (book) => normalizeStrings(book.title) === normalizeStrings(title)
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "Could not find books with this title" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn]?.reviews;

  if (reviews) {
    return res.status(300).send(reviews);
  } else {
    return res.status(404).json({ message: "Could not find the book" });
  }
});

module.exports.general = public_users;
