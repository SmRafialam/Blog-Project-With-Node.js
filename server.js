const express = require('express');
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const app = express();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;


var MongoCLient = require('mongodb').MongoClient;

var URL = "mongodb+srv://demoPruvit:demoPruvit@cluster0.linavqe.mongodb.net/?retryWrites=true&w=majority";

app.use("/static",express.static(__dirname + "/static"));
app.set("view engine","ejs");

var storage = multer.diskStorage({
    destination:function(req,file,callback){
        var dir = "static/uploads";
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }else{
            callback(null.dir);
        }

    },
    filename:function(req,res,callback){
        callback(null,file.originalname);
    }
});

//var upload = multer({storage:storage}).array('files',12);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

MongoCLient.connect(URL,function(error,MyMongoClient){
    var upload = multer({storage:storage}).array('files',12);
    var dbblog = MyMongoClient.db("blog");
    if(error){
        console.log("Connection failed");
    }else{
        console.log("DB Connection success");
        // DeleteAllData(MyMongoClient);

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
            // res.send("Blog posted successfully");
            upload(req,res,function(err){
                            if(err){
                                res.send("Something gone wrong!");
                            }else{
                                res.send("Upload Complete.");
                
                            }
                        }); 

        });
        
        
    })
    app.post('/do-blogdetails',function(req,res){
        dbblog.collection("blogdetails").insertOne(req.body,function(error,document){
            res.send("Blog Details posted successfully");

        });
        
    })

    // app.post('/do-upload-image',function(req,res){
    //     dbblog.collection("blog").insertOne(req.body,function(error,document){
    //         upload(req,res,function(err){
    //             if(err){
    //                 res.send("Something gone wrong!");
    //             }else{
    //                 res.send("Upload Complete.");
    
    //             }
    //         }); 

    //     });
        
        
    //})
    // app.post('/do-upload-image',function(req,res){
    //     var formData = new formidable.IncomingForm();
    //     formData.parse(req,function(error,fields,files){
    //         var oldPath = files.file.path;
    //         var newPath = "static/uploads/" + files.file.name;
    //         fs.rename(oldPath,newPath,function(err){
    //             res.send("/" + newPath);
    //         });
    //     });
    // });
    // app.get('/blog/:id',function(req,res){
    //     dbblog.collection("blog").findOne({"_id":ObjectId(req.params.id)},function(error,blogdetails){
    //         res.render("user/home", {blog:blog});

    //     })
    // })

    app.get('/:id',function(req,res){
        dbblog.collection("blog").findOne({"_id":ObjectId(req.params.id)},function(error,blog){
            res.render("user/home");

        })
    })
    app.get('/blogdetails/:id',function(req,res){
        dbblog.collection("blogdetails").findOne({"_id":ObjectId(req.params.id)},function(error,blogdetails){
            res.render("user/blogdetails");

        })
    })

    function DeleteAllData(MyMongoClient){
        var MyDatabase = MyMongoClient.db("blog");
        var MyCollection = MyDatabase.collection("blog");
    
        MyCollection.deleteMany(function(error,ResultObj){
            if(error){
                console.log("All Data DELETE fail");
            }else{
                console.log("All Data DELETE success");
    
            }
        });
    }
    app.listen(3000,function(){
        console.log('Connected Successfully');
    })
});
