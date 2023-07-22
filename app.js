const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// init app & middleware
const app = express();
app.use(express.json());

//  db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    db = getDb();
  }
});

//  routes
// gett books and pagination
app.get("/books", (req, res) => {
  // current page
  const page = req.query.p || 0;
  const bookPerPage = 5;
  let books = [];

  db.collection("books")
    .find()
    .sort({ auther: 1 })
    .skip(page * bookPerPage)
    .limit(bookPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ err: "could not fetch the document" });
    });
});

app.get("/books/:id", (req, res) => {
  // check if the id is valid
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ err: "Could not fetch the document" });
      });
  } else {
    res.status(400).json({ err: "Invalid id" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ err: "Could not create new document" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "Could not delete the document" });
      });
  } else {
    res.status(400).json({ err: "Invalid id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "Could not update the document" });
      });
  } else {
    res.status(400).json({ err: "Invalid id" });
  }
});

//  create pagination route
// app.get("/books/pages/:page", (req, res) => {
//   const page = req.params.page;
//   const limit = 10;
//   const skip = (page - 1) * limit;
//   let books = [];

//   db.collection("books")
//     .find()
//     .sort({ auther: 1 })
//     .skip(skip)
//     .limit(limit)
//     .forEach((book) => books.push(book))
//     .then(() => {
//       res.status(200).json(books);
//     })
//     .catch(() => {
//       res.status(500).json({ err: "could not fetch the document" });
//     });
// });

// //  create search route
// app.get("/books/search/:search", (req, res) => {
//   const search = req.params.search;
//   let books = [];

//   db.collection("books")
//     .find({ $text: { $search: search } })
//     .sort({ auther: 1 })
//     .forEach((book) => books.push(book))
//     .then(() => {
//       res.status(200).json(books);
//     })
//     .catch(() => {
//       res.status(500).json({ err: "could not fetch the document" });
//     });
// });

// //  create sort route
// app.get("/books/sort/:sort", (req, res) => {
//   const sort = req.params.sort;
//   let books = [];

//   db.collection("books")
//     .find()
//     .sort({ [sort]: 1 })
//     .forEach((book) => books.push(book))
//     .then(() => {
//       res.status(200).json(books);
//     })
//     .catch(() => {
//       res.status(500).json({ err: "could not fetch the document" });
//     });
// }
// );

// //  create filter route
// app.get("/books/filter/:filter", (req, res) => {
//   const filter = req.params.filter;
//   let books = [];

//   db.collection("books")
//     .find({ auther: filter })
//     .sort({ auther: 1 })
//     .forEach((book) => books.push(book))
//     .then(() => {
//       res.status(200).json(books);
//     })
//     .catch(() => {
//       res.status(500).json({ err: "could not fetch the document" });
//     });
// }
// );
