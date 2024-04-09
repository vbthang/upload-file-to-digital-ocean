'use strict'

const path = require('path');
const https = require('https');
const aws = require('aws-sdk');
const fs = require('fs');

// const putObject = async ({s3, pathSpace, fileName, type}) => {
//     const pathFile = path.join(__dirname, '../uploads/', fileName)
//     if(!fs.existsSync(pathFile)) {
//         console.log(`Not found ${fileName} in local`);
//         return 
//     } 
//     const urlToCheck = `${process.env.DO_DOMAIN}/${pathSpace}/${fileName}`;
//     await checkLinkExistence(urlToCheck, (exists) => {
//         if(!exists) {
//         const file = fs.readFileSync(pathFile);
//         s3.putObject({
//             Bucket: process.env.DO_SPACES_NAME,
//             Key: `${pathSpace}/${fileName}`,
//             Body: file,
//             ACL: 'public-read',
//             ContentType: type
//         }, (err, data) => {
//             if(err) {
//             console.log('An error occurred: ', err);
//             return
//             } 
//             console.log(`Your file ${fileName} has been uploaded successfully`, data)
//         })
//         } else {
//         console.log(`File ${fileName} exists on Spaces`);
//         }
//     });
// }

// const uploadDataToDO = async (req, res) => {
//     const id = req.query.id
//     const spaceEndpoint = new aws.Endpoint( process.env.DO_SPACES_ENDPOINT )

//     const s3 = new aws.S3({
//         endpoint: spaceEndpoint,
//         accessKeyId: process.env.DO_SPACES_KEY,
//         secretAccessKey: process.env.DO_SPACES_SECRET,
//     })
//     console.log(`**********************************************`);
//     console.log(`**************   START UPLOAD   **************`);
//     console.log(`**********************************************`);
//     putObject({s3, pathSpace: process.env.DO_FILE_SONG, fileName: `${id}.mp3`, type: 'audio/mpeg'})
//     putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${id}x96.jpg`, type: 'image/jpeg'})
//     putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${id}x240.jpg`, type: 'image/jpeg'})
//     putObject({s3, pathSpace: process.env.DO_FILE_LYRIC, fileName: `${id}.lrc`, type: 'text/plain'})
//     res.send({
//         msg: 'Nothing is too small to know, and nothing too big to attempt'
//     })
// }

// 
class S3 {
    static instance;

    static getInstance() {
        if (!this.instance) {
            const spaceEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
            this.instance = new aws.S3({
                endpoint: spaceEndpoint,
                accessKeyId: process.env.DO_SPACES_KEY,
                secretAccessKey: process.env.DO_SPACES_SECRET,
            });
        }
        return this.instance;
    }
}

const checkLinkExistence = async (url) => {
    return new Promise((resolve, reject) => {
        https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        }).on('error', reject).end();
    });
};

const putFileToDO = async ({ pathSpace, fileName, type }) => {
    const s3 = S3.getInstance();
    const pathFile = path.join(__dirname, '../uploads/', fileName);
    console.log(pathFile);

    try {
        const exists = await checkLinkExistence(`${process.env.DO_DOMAIN}/${pathSpace}/${fileName}`);
        if (exists) {
            console.log(`File ${fileName} exists on Spaces`);
            return;
        }

        if (!fs.existsSync(pathFile)) {
            console.log(`Not found ${fileName} in local`);
            return;
        }

        const fileData = await fs.promises.readFile(pathFile);
        await s3.putObject({
            Bucket: process.env.DO_SPACES_NAME,
            Key: `${pathSpace}/${fileName}`,
            Body: fileData,
            ACL: 'public-read',
            ContentType: type
        }).promise();

        console.log(`Your file ${fileName} has been uploaded successfully`);
    } catch (err) {
        console.error('An error occurred: ', err);
    }
};



module.exports = {
    // putObject,
    // uploadDataToDO,
    putFileToDO
}