'use strict'

const aws = require('aws-sdk');
const fs = require('fs');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const https = require('https');
dotenv.config()

const getDataFromAPI = async (req, res) => {
  try {
    const id = req.body.song_id;
    const response = await axios.get(`${process.env.SERVER_API}/${id}`)
    const metadata = response.data.metadata;
    res.send(metadata)
  } catch (error) {
    console.error('An error occurred: ', error);
    res.status(500).send('Internal Server Error');
  }
}

const checkLinkExistence = (url, callback) => {
  https.request(url, { method: 'HEAD' }, (res) => {
    callback(res.statusCode >= 200 && res.statusCode < 400);
  }).end();
};

const putObject = ({s3, pathSpace, fileName, type}) => {
  const pathFile = path.join(__dirname, '../uploads/', fileName)
  if(!fs.existsSync(pathFile)) {
    console.log(`Not found ${fileName} in local`);
    return 
  } 
  const urlToCheck = `${process.env.DO_DOMAIN}/${pathSpace}/${fileName}`;
  checkLinkExistence(urlToCheck, (exists) => {
    if(!exists) {
      const file = fs.readFileSync(pathFile);
      s3.putObject({
        Bucket: process.env.DO_SPACES_NAME,
        Key: `${pathSpace}/${fileName}`,
        Body: file,
        ACL: 'public-read',
        ContentType: type
      }, (err, data) => {
        if(err) {
          console.log('An error occurred: ', err);
          return
        } 
        console.log(`Your file ${fileName} has been uploaded successfully`, data)
      })
    } else {
      console.log(`File ${fileName} exists on Spaces`);
    }
  });
}

const uploadDataToDO = async (req, res) => {
  const id = req.query.id
  const spaceEndpoint = new aws.Endpoint( process.env.DO_SPACES_ENDPOINT )

  const s3 = new aws.S3({
    endpoint: spaceEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  })
  console.log(`**********************************************`);
  console.log(`**************   START UPLOAD   **************`);
  console.log(`**********************************************`);
  putObject({s3, pathSpace: process.env.DO_FILE_SONG, fileName: `${id}.mp3`, type: 'audio/mpeg'})
  putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${id}x96.jpg`, type: 'image/jpeg'})
  putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${id}x240.jpg`, type: 'image/jpeg'})
  putObject({s3, pathSpace: process.env.DO_FILE_LYRIC, fileName: `${id}.lrc`, type: 'text/plain'})
  res.send({
    msg: 'Nothing is too small to know, and nothing too big to attempt'
  })
}

module.exports = {
  getDataFromAPI,
  uploadDataToDO
}