const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("./middleware/cloudinary");
// const upload = require("./middleware/multer");
// const fs = require('fs');
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { join } = require("path");
const axios = require("axios");
const { image } = require("./middleware/cloudinary");
require("dotenv").config({ path: "./config/.env" });
const app = express();

// app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("uploads"));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested, Content-Type, Accept Authorization"
//   )
//   if (req.method === "OPTIONS") {
//     res.header(
//       "Access-Control-Allow-Methods",
//       "POST, PUT, PATCH, GET, DELETE"
//     )
//     return res.status(200).json({})
//   }
//   next()
// })

app.use(cors());

// let PORT = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });



const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.DB_STRING;
MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to Database");
    const db = client.db("lostFound");
    const items = db.collection("items");
    const images = db.collection("images");

    app.get("/", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((results) => {
          res.json(results);
        })
        .catch((error) => console.error(error));
    });

    app.post("/newItem", upload.single("image"), async (req, res) => {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);

        //   return {content:req.body}
        //   console.log(  res.json({content:req.body}))
        let title = req.body.title,
          image = result.secure_url,
          location = req.body.location,
          description = req.body.description,
          date_found = req.body.date_found,
          identifying_question = req.body.identifying_question,
          claimed = false,
          contact_name = req.body.contact_name,
          email = req.body.email,
          phonenumber = req.body.phonenumber;

        items.insertOne({
          title: title,
          image: image,
          location: location,
          description: description,
          date_found: date_found,
          identifying_question: identifying_question,
          claimed: claimed,
          contact_name: contact_name,
          email: email,
          phonenumber: phonenumber,
          date: new Date(),
        });
      } catch (err) {
        console.log(err);
      }

    });

    // app.post('/upload', upload.single("image"), async (req, res)=>{
    //  console.log(req)
    //   console.log(req.file)
    // const result = await cloudinary.uploader.upload(req.file.path);
    //   images.insertOne({image: result.secure_url})
    //   res.json()
    // app.get('/newItem', (req,res)=>{
    //   console.log("Hello")
    // })
    // await fetch("http://localhost:3000/newItem")
    // .then((response)=> console.log(response.content))
    // ;

    // })

    app.put("/editItem/:id", (req, res) => {
      // console.log(req.body);
      const ObjectId = require("mongodb").ObjectId;
      db.collection("items")
        .updateOne(
          { _id: ObjectId(req.params.id) },
          {
            $set: {
              title: req.body.title,
              image: req.body.image,
              location: req.body.location,
              description: req.body.description,
              date_found: req.body.date_found,
              identifying_question: req.body.identifying_question,
              claimed: req.body.claimed,
              contact_name: req.body.contact_name,
              email: req.body.email,
              phonenumber: req.body.phonenumber,
              // date:new Date()
            },
          }
        )
        .then((result) => {
          console.log("completed");
          res.json({ result: result });
        })
        .catch((error) => console.error(error));
    });

    app.delete("/deleteItem/:id", (req, res) => {
      const ObjectId = require("mongodb").ObjectId;
      let id = req.params.id;
      // console.log("req.body.task is " ,req.body.id);
      db.collection("items")
        .deleteOne({ _id: ObjectId(id) })
        .then((result) => {
          console.log("deleted");
          res.json(result);
        })
        .catch((error) => console.log(error));
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
