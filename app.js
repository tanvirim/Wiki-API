// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

// Create an instance of the Express application
const app = express();

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up mongoose to connect to a MongoDB database
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Set up EJS as the view engine
app.set("view engine", "ejs");

//making article schema

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

// Define a function to handle the form submission
function saveArticle(article) {
  Article.findOne({ title: article.title }, function (err, foundArticle) {
    if (err) {
      console.error(err);
    } else if (foundArticle) {
      console.log("Article already exists in the database.");
    } else {
      const newArticle = new Article(article);
      newArticle.save(function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("Article saved to database.");
        }
      });
    }
  });
}

// Example usage:
// When the form is submitted, call the saveArticle function with the submitted article
const submittedArticle1 = {
  title: "My First Article",
  content: "This is the content of my first article.",
};

saveArticle(submittedArticle1);

//route handaling
app
  .route("/articles")

  .get((req, res) => {
    Article.find((err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        console.log(err);
      }
    });
  })

  .post((req, res) => {
    Article.findOne({ title: req.params.title }, function (err, foundArticle) {
      if (err) {
        console.error(err);
      } else if (foundArticle) {
        console.log("Article already exists in the database.");
      } else {
        const newArticle = new Article({
          title: req.body.title,
          content: req.body.content,
        });

        newArticle.save(function (err) {
          if (err) {
            console.error(err);
          } else {
            res.send("ärticle saved to database");
          }
        });
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("successfully deleted");
      }
    });
  });

//get a specific article

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article named " + req.params.articleTitle + " is found");
      }
    });
  })

  .put((req,res)=>{
    Article.findOneAndUpdate(
        {
            title: req.params.articleTitle
        },
        {
            title : req.body.title , content : req.body.content
        },
        {overwrite : true} ,
        (err)=>{
            if(!err){
            
                res.send("successfully updated articel")
            }
        }
    )
    })

    .patch((req,res)=>{
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set : req.body},
            (err)=>{
                if(!err){
                    res.send("successfully updated")
                }else{
                    res.send(err)
                }
            }
        )
    }) 
    .delete((req,res)=>{
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err)=>{
                if(err){
                    res.send(err)
                }else{
                    res.send("successfully deleted from database")
                }
            }
        )
    })

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
})


