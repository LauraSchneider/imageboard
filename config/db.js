//server side & LOGS IN TERMINAL
const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets.json');
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
const {s3Url} = require("./config.json");

function getImages() {
    return new Promise((resolve,reject) => {
        const q = 'SELECT * FROM images';
        db.query(q).then(results => {
            // console.log("results from our query", results.rows);
            let images = results.rows; //loop thru results an array of objects (item is the object)
            images.forEach(item => {
                let url = s3Url + item.image; //***IMPORTANT
                item.image = url;
            });
            resolve(images);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    getImages
};
