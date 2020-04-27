/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

const mongoose = require("mongoose");
const mongo = require("mongodb");
const config = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

const { Book } = require("../models/Book");

mongoose.connect(process.env.DATABASE, config);

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function(err, books) {
        let booksList = [];

        if (err) {
          console.log("Error");
        }

        books.forEach(function(book) {
          booksList.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          });
        });

        return res.status(200).json(booksList);
      });
    })

    .post(function(req, res) {
      var title = req.body.title;
      const comments = [];
      const _id = generateID();

      if (!title) {
        res.send("Missing Title");
      }

      const newBook = new Book({ title: title, comment: comments, _id: _id });
      newBook.save(function(err) {
        if (err) {
          console.log(err);
          return;
        }
        return res.status(200).json({ title: title, comments: comments, _id: _id });
      });
      //res.json({"title":title, "comments": comments, "_id": _id})
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err, removed) {
        if (err) {
          console.log("Error");
        }
        console.log("complete delete successful");
        return res.status(200).json("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      let retrieveBook = {};

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.find({ _id: bookid }, function(err, book) {
        if (err) {
          console.log("Error");
        }

        if (!book) {
          return res.status(400).send("no book exists");
        }

        // Even if is only one
        book.forEach(function(book) {
          retrieveBook = {
            _id: book._id,
            title: book.title,
            comments: book.comments
          };
        });

        return res.status(200).json(retrieveBook);
      });
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findOne({_id: bookid}, function(err, book) {
        if (err) {
          console.log("Error");
        }

        if (book) {
          book.comments.push(comment);
          book.save((err, pro) => {
            if (err) {
              console.log("Error");
            }
            return res.status(200).json({_id: pro._id, title: pro.title, comments: pro.comments});
          });
        }
      });
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'complete delete successful'
      Book.deleteOne({_id: bookid}, function(err, removed) {
        if (err) {
          console.log("Error");
        }
        console.log("delete successful");
        return res.status(200).json("delete successful");
      });
    });
};

// Function to generate Book ID
function generateID() {
  let id = "";
  let values = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 3; i++) {
    id += values.charAt(Math.floor(Math.random() * values.length));
  }
  return id;
}
