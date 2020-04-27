/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let id;
  
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Test" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "comments", "Has comments");
              assert.isArray(res.body.comments, "Is an Array");
              assert.property(res.body, "title", "Has title");
              assert.property(res.body, "_id", "Has id");
              assert.equal(res.body.title, "Test");
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "Missing Title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "Is and Array");
            assert.property(res.body[0], "commentcount", "Has commentcount");
            assert.property(res.body[0], "title", "Has title");
            assert.property(res.body[0], "_id", "Has id");
            id = res.body[0]._id;
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/123412341234")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "Doesnt exist");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, "Is an Array");
            assert.property(res.body, "comments", "Has comments");
            assert.property(res.body, "title", "Has title");
            assert.property(res.body, "_id", "Has id");
            assert.equal(res.body._id, id);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({ comment: "Test" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body.comments, "Is an Array");
              assert.property(res.body, "comments", "Has comments");
              assert.include(
                res.body.comments,
                "Test",
                "Has TEST as a comment"
              );
              assert.property(res.body, "title", "Has title");
              assert.property(res.body, "_id", "Has id");
              done();
            });
        });
      }
    );
  });
});
