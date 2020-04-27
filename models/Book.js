const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String},
  commentcount: {type: Number},
  comments: { type: Array},
  _id: { type: String}
});

const Book= mongoose.model("Book", BookSchema);

module.exports.Book = Book;