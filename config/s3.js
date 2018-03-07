const knox = require('knox');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
    console.log("SECRETS", secrets);
}

const client = knox.createClient({key: secrets.accesskeyidaws, secret: secrets.secretaccesskeyaws, bucket: 'laura-imageboard'});

//middleware
function upload(req, res, next) {
    if (!req.file) {
        console.log("FS3 check");
        res.sendStatus(500);
        return; //returns this if multer part didn't work
    }
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read' //setting permission of the file
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        fs.unlink(req.file.path, () => {}); //removes from uploads folder
        if (wasSuccessful) {
            next();
        } else {
            console.log(s3Response.statusCode);
            res.sendStatus(500); //returns this if amazon doesn't work
        }
    });
}

exports.upload = upload;
