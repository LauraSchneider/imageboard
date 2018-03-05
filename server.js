//server side & LOGS in TERMINAL
const express = require('express');
const app = express();
const db = require('./config/db')
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/images', (req, res) => {
    console.log("CHECKING IMAGES ROUTE");
    db.getImages().then(images => {
        // results refering to images from db

        console.log("IMAGES", images);
        res.json({images: images}); //Sending response back to client
    });//back to clienet --> whatever we put in res.json gets captured in axios of the 'then' of our GET request
});

app.listen(8080, () => console.log("glistening"));
