//server side & LOGS in TERMINAL
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./config/s3');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json()); //boilerplate for sending info over to server as an object so we need this line, so req.body won't be empty anymore.

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {

    if (req.file) {
        db.addImagesToBrowser(req.body.title, req.body.description, req.body.username, req.file.filename).then(results => {
            // console.log("RESULTS",results);
            res.json({images: results[0]});
        });
    } else {

        res.json({success: false});
    }
});

app.get('/images', (req, res) => {
    // console.log("CHECKING IMAGES ROUTE");
    db.getImages().then(images => {
        // results refering to images from db
        // console.log("IMAGES", images);
        res.json({images: images}); //Sending response back to client
    }); //back to client --> whatever we put in res.json gets captured in axios of the 'then' of our GET request
});

app.get('/modal/:selectedImageID', (req, res) => {
    db.getImageInfo(req.params.selectedImageID).then(results => {
        db.getComment(req.params.selectedImageID).then(data => {
            res.json({results, data});

        });
    });

    //req.params is for urls with : word. & req.body is for user input
});

app.post('/comments', (req, res) => {
    // console.log("RESULTS", req.body);
    db.postComment(req.body.comment, req.body.username, req.body.id).then(results => {
        res.json({results});
    });
});

app.get('/scroll/:lastImageID', (req, res) => {
    db.getMorePics(req.params.lastImageID).then(results => {
        console.log("RESULTTS", results);
        res.json({results});
    });

});
app.listen(8080, () => console.log("glistening"));
