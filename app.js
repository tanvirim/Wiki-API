// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

// Create an instance of the Express application
const app = express();

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up mongoose to connect to a MongoDB database
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Define a basic route
app.get('/articles', (req, res) => {
  Article.find((err,foundArticle)=>{
    if(!err){
        res.send(foundArticle);
    }else{
        console.log(err);
    }

  })
});

//making article schema

const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  });

const Article = mongoose.model('Article', articleSchema);

//post request handle
app.post("/articles",  (req,res)=>{

    Article.findOne({ title: req.params.title }, function (err, foundArticle) {
        if (err) {
          console.error(err);
        } else if (foundArticle) {
          console.log('Article already exists in the database.');
        } else {
            const newArticle = new Article({
                title: req.body.title,
                content:req.body.content
            });

          newArticle.save(function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log('Article saved to database.');
            }
          });
        }
      });

})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});





// Define a function to handle the form submission
function saveArticle(article) {
    Article.findOne({ title: article.title }, function (err, foundArticle) {
      if (err) {
        console.error(err);
      } else if (foundArticle) {
        console.log('Article already exists in the database.');
      } else {
        const newArticle = new Article(article);
        newArticle.save(function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log('Article saved to database.');
          }
        });
      }
    });
  }
  
  // Example usage: 
  // When the form is submitted, call the saveArticle function with the submitted article
  const submittedArticle1 = {
    title: "My First Article",
    content: "This is the content of my first article."
  };
  const submittedArticle2 = {
    title: "My second Article",
    content: "This is the content of my second article."
  };
  const submittedArticle3 = {
    title: "My third Article",
    content: "This is the content of my third article."
  };
  saveArticle(submittedArticle1);
  saveArticle(submittedArticle2);
  saveArticle(submittedArticle3);