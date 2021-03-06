//SERVER SIDE & LOGS IN TERMINAL
const spicedPg = require('spiced-pg');
const {dbUser, dbPass} = require('./secrets.json');
const db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
const {s3Url} = require("./config.json");

function getImages() {
    return new Promise((resolve, reject) => {
        const q = 'SELECT * FROM images ORDER BY created_at DESC LIMIT 12';
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

function addImagesToBrowser(title, description, username, image) {
    return new Promise((resolve, reject) => {
        const q = 'INSERT into images (title, description, username, image) VALUES ($1, $2, $3, $4) RETURNING *'; //* getting back the row
        const params = [title, description, username, image];
        db.query(q, params).then(results => {
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
                //whenever pulling image out of a db, you have to use the url
            });
            resolve(images);
        }).catch(err => {
            reject(err);

        });
    });
}

function getImageInfo(selectedImageID) {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM images WHERE id = $1`; //passing db the id and retrieving a row.
        const params = [selectedImageID];
        db.query(q, params).then(results => {
            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
            });
            resolve(images);
        }).catch(err => {
            reject(err);
        });
    });
}

function postComment(comment, username, selectedImageID) {
    return new Promise((resolve, reject) => {
        const q = `INSERT INTO comments (comment, username,  image_id) VALUES ($1, $2, $3) RETURNING *`;
        const params = [comment, username, selectedImageID];
        db.query(q, params).then(results => {
            // console.log("RESULTS ROW", results);
            resolve(results.rows[0]); //always results.addImagesToBrowser. it's row[0], if you want just 1 row back.
        }).catch(err => {
            reject(err);
        });
    });
}

function getComment(selectedImageID) {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM comments WHERE image_id= $1`;
        const params = [selectedImageID];
        db.query(q, params).then(results => {
            resolve(results.rows); //it's .rows if you want all the rows info back.
        }).catch(err => {
            reject(err);
        });
    });
}

function getMorePics(lastImageID) {
    return new Promise((resolve, reject) => {
        const q = `SELECT * FROM images WHERE id < $1 ORDER BY created_at DESC LIMIT 12`; //insert value of last image id.
        const params = [lastImageID];
        db.query(q, params).then(results => {

            let images = results.rows;
            images.forEach(item => {
                let url = s3Url + item.image;
                item.image = url;
            });
            resolve(results.rows);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    getImages,
    addImagesToBrowser,
    getImageInfo,
    postComment,
    getComment,
    getMorePics
};
