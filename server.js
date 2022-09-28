const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;


var MongoCLient = require('mongodb').MongoClient;

var URL = "mongodb+srv://demoPruvit:demoPruvit@cluster0.linavqe.mongodb.net/?retryWrites=true&w=majority";

app.use("/static",express.static(__dirname + "/static"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

MongoCLient.connect(URL,function(error,MyMongoClient){
    var dbblog = MyMongoClient.db("blog");
    if(error){
        console.log("Connection failed");
    }else{
        console.log("DB Connection success");

    }

    app.get('/',function(req,res){
        dbblog.collection("blog").find().toArray(function(error,blog){
            blog = blog.reverse();
            res.render("user/home", {blog:blog});

        });
    })

    app.get('/blogdetails',function(req,res){
        dbblog.collection("blogdetails").find().toArray(function(error,blogdetails){
            blogdetails = blogdetails.reverse();
            res.render("user/blogdetails", {blogdetails:blogdetails});

        });
    })

    app.get('/admin/dashboard',function(req,res){
        res.render("admin/dashboard");
    })

    app.get('/admin/blog',function(req,res){
        res.render("admin/blog");
    })

    app.get('/admin/bloglist',function(req,res){
        res.render("admin/bloglist");
    })
    
    app.get('/admin/blogdetails',function(req,res){
        res.render("admin/blogdetails");
    })

    app.post('/do-post',function(req,res){
        dbblog.collection("blog").insertOne(req.body,function(error,document){
            res.send("Blog posted successfully");

        });
        
    })
    app.post('/do-blogdetails',function(req,res){
        dbblog.collection("blogdetails").insertOne(req.body,function(error,document){
            res.send("Blog Details posted successfully");

        });
        
    })

    // app.get('/blog/:id',function(req,res){
    //     dbblog.collection("blog").findOne({"_id":ObjectId(req.params.id)},function(error,blogdetails){
    //         res.render("user/home", {blog:blog});

    //     })
    // })

    app.get('/blogdetails/:id',function(req,res){
        dbblog.collection("blogdetails").findOne({"_id":ObjectId(req.params.id)},function(error,blogdetails){
            res.render("user/blogdetails");

        })
    })

    app.listen(3000,function(){
        console.log('Connected Successfully');
    })
});
