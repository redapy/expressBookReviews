const express = require("express");
let books = require("./booksdb.js");
let { users, isValid } = require("./auth_users.js").isValid;

const public_users = express.Router();

const normalizeStrings = (string) => string.toLowerCase().trim();
public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const formatedBooks = JSON.stringify(books, null, 4);
  return res.status(300).send(formatedBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(300).send(book);
  } else {
    return res.status(404).json({ message: "Could not find the book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const book = booksArray.find(
    (book) => normalizeStrings(book.author) === normalizeStrings(author)
  );

  if (book) {
    return res.status(300).send(book);
  } else {
    return res.status(404).json({ message: "Could not find the book" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const book = booksArray.find(
    (book) => normalizeStrings(book.title) === normalizeStrings(title)
  );

  if (book) {
    return res.status(300).send(book);
  } else {
    return res.status(404).json({ message: "Could not find the book" });
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
