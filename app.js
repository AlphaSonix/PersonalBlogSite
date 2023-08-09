//jshint esversion:6

import express from 'express';
import https from 'https';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mongoose } from 'mongoose';
import pkg from 'lodash';

const homeStartingContent = "Writer. Programmer. Tea Drinker. Just Ken.";
const aboutContent = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const contactContent = "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
//const posts = []; 
const _ = pkg; 
//let postParams = ""; 

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://jermain-admin:pBEY2qxOXmLgfBPm@cluster0.4bae75f.mongodb.net/blogDB')
.then(() => console.log('Connected!'));

const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("Post", postSchema);

const postArr = [];

app.get("/", function (req, res) {

async function findItem() {

try {
const posts = await Post.find();

if (posts.length === 0) {
    Post.insertMany(postArr)
    // .then(()=>{
        
    //    res.redirect("/");  
    // })
}
res.render('home', {homeText: homeStartingContent, blogPosts: posts});
} catch(e) {
    console.log(e);
}}
findItem();
});    


app.get("/about", function (req, res) {
    res.render('about', {aboutText: aboutContent});
})

app.get("/contact", function (req, res) {
    res.render('contact', {contactText: contactContent});
})

app.get("/compose", function (req, res) {
    res.render('compose');
})

app.post("/compose", function (req, res) {
    //let post = req.body.newPost;
    
    const post = new Post({
        title: req.body.newTitle,
        image: req.body.newImage,
        message: req.body.newPost
    });
    //postParams = post;

    post.save();
    //posts.push(post);
    res.redirect("/");
})

app.get("/posts/:postID", function (req, res) {
    
    //matching ID with database 
    const postID = req.params.postID; 
    
    Post.findOne({_id: postID}) 
    .then(function (post) {
            res.render('post', {postTitle: post.title, postMessage: post.message});
    })
        .catch (function (err) {
            console.log(err);
    });

    //Displaying post with ID number without Database
    // const param = _.kebabCase(_.lowerCase(req.params.postID)); 

    // posts.forEach(function(post) {
    //     const queryTitle = _.kebabCase(_.lowerCase(post.title));

    // if (param === queryTitle) {
    //     console.log(queryTitle + " = Match found!");
    //     res.render('post', {postTitle: post.title, postImage: post.image, postMessage: post.message});
    // } 
    // })   
})

const port = process.env.PORT || 3000

app.listen(port, function() {
    console.log("Communications successful");
})