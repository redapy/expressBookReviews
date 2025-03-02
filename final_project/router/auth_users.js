const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userIndex = users.findIndex((user) => user.username === username);
  return userIndex > -1;
};

const authenticatedUser = (username, password) => {
  const userIndex = users.findIndex(
    (user) => user.username === username && user.password === password
  );
  return userIndex > -1;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username) res.status(400).json({ message: "username is required" });
  if (!password) res.status(400).json({ message: "password is required" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken,
      username,
    };

    res.status(200).send(`you are logged in! Welcome ${username}`);
  } else {
    res.status(401).json({ message: "user not found or not registered" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!isbn) res.status(400).json({ message: "isbn is required" });
  if (!review)
    res.status(400).json({ message: "review must be a valid string" });

  const book = books[isbn];
  if (book) {
    const bookReviews = books[isbn].reviews;

    book.reviews = { ...bookReviews, [username]: review };
    console.log(books[isbn]);
    res.status(200).json({ message: "review added successfully" });
  } else {
    res.status(400).json({ message: "book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!isbn) res.status(400).json({ message: "isbn is required" });

  const reviewedBooksByUser = Object.values(books).filter(
    (book) => !!book?.reviews?.[username]
  );

  if (reviewedBooksByUser.length === 0) {
    return res.status(400).json({ message: "You have not review this book" });
  }

  const book = books[isbn];
  if (book) {
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "review deleted successfully" });
  } else {
    return res.status(400).json({ message: "book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
