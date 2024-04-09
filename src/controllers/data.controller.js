'use strict'

const aws = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const https = require('https');

// const downloadFile = async (fileUrl, fileName) => {
//   try {
//     const response = await axios.get(fileUrl, {
//       responseType: 'stream'
//     });
//     const writer = fs.createWriteStream(`./src/uploads/${fileName}`);
//     response.data.pipe(writer);
//     return new Promise((resolve, reject) => {
//       writer.on('finish', resolve);
//       writer.on('error', reject);
//     });
//   } catch (error) {
//     throw new Error('Error downloading file: ' + error.message);
//   }
// };

// const downloadAndSaveFiles = async (files) => {
//   try {
//     const downloads = files.map(async (file) => {
//       await downloadFile(file.url, file.fileName);
//       console.log(`Downloaded ${file.fileName} successfully!`);
//     });
//     await Promise.all(downloads);
//   } catch (error) {
//     console.error('An error occurred while downloading files:', error);
//   }
// };

// // DELETE
// const deleteFile = async (filePath) => {
//   try {
//     await fs.promises.unlink(filePath);
//     console.log(`Deleted file ${filePath} successfully!`);
//   } catch (error) {
//     throw new Error('Error deleting file: ' + error.message);
//   }
// };

// const deleteFiles = async (filePaths) => {
//   try {
//     const deletions = filePaths.map(async (filePath) => {
//       await deleteFile(filePath);
//     });
//     await Promise.all(deletions);
//   } catch (error) {
//     console.error('An error occurred while deleting files:', error);
//   }
// };

const renderPlaylist = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER_API_PLAYLIST}`);

    const allItems = response.data.metadata.reduce((acc, playlist) => {
      return acc.concat(playlist.items);
    }, []);

    let playlists = [];

    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      
      const itemResponse = await axios.get(`${process.env.SERVER_API_PLAYLIST_INFO}/${item.id}`);
      let songIds = [];
      if (itemResponse.data.metadata) {
        // Lặp qua mỗi bài hát trong danh sách và lấy id của nó
        for (let j = 0; j < itemResponse.data.metadata.length; j++) {
          songIds.push(itemResponse.data.metadata[j].id);
        }
      }

      playlists.push({
        ...item,
        songs: songIds
      });
    }

// HANDLE PLAYLIST
//     for(let i = 4; i <5; i++) {
    // let pl = playlists[18]

    // for(let j = 0; j < pl.songs.length; j++) {
    //   let song = pl.songs[j]
    //   try {
    //     await pro(song)
        
    //   } catch (error) {
    //     console.log(`ERROR`);
    //   }
    // }
//     }
    

    // const filesToDelete = [
    //   './src/uploads/' + fileName +'.mp3',
    //   './src/uploads/' + fileName +'x96.jpg',
    //   './src/uploads/' + fileName +'x240.jpg',
    //   './src/uploads/' + fileName +'.lrc',
    // ];
    
    // await deleteFiles(filesToDelete);
    let i = 0
    const playlistRes = playlists.map((pl) => {
      return {
        index: i++,
        title: pl.title
      };
    });
    
    res.json(playlists);
  } catch (error) {
    console.error('An error occurred: ', error);
    res.status(500).send('Internal Server Error');
  }
}

// const pro = async (song) => {
//   const songResponse = await axios.get(`${process.env.SERVER_API}/${song}`)
//   const fileName = songResponse.data.metadata.id;
  
//   const filesToDownload = [
//     { url: songResponse.data.metadata.stream_path, fileName: fileName +'.mp3' },
//     { url: songResponse.data.metadata.thumbnail_path, fileName: fileName +'x96.jpg' },
//     { url: songResponse.data.metadata.thumbnailM_path, fileName: fileName +'x240.jpg' },
//     { url: songResponse.data.metadata.lyric_path, fileName: fileName +'.lrc' },
//   ];

//   await downloadAndSaveFiles(filesToDownload);

//   const spaceEndpoint = new aws.Endpoint( process.env.DO_SPACES_ENDPOINT )

//   const s3 = new aws.S3({
//     endpoint: spaceEndpoint,
//     accessKeyId: process.env.DO_SPACES_KEY,
//     secretAccessKey: process.env.DO_SPACES_SECRET,
//   })
//   console.log(`**********************************************`);
//   console.log(`**************   START UPLOAD   **************`);
//   console.log(`**********************************************`);
//   await Promise.all([
//     putObject({s3, pathSpace: process.env.DO_FILE_SONG, fileName: `${fileName}.mp3`, type: 'audio/mpeg'}),
//     putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${fileName}x96.jpg`, type: 'image/jpeg'}),
//     putObject({s3, pathSpace: process.env.DO_FILE_THUMBNAIL, fileName: `${fileName}x240.jpg`, type: 'image/jpeg'}),
//     putObject({s3, pathSpace: process.env.DO_FILE_LYRIC, fileName: `${fileName}.lrc`, type: 'text/plain'})
//   ]);
// }

// const getDataFromAPI = async (req, res) => {
//   try {
//     const id = req.body.song_id;
//     const response = await axios.get(`${process.env.SERVER_API}/${id}`)
//     const metadata = response.data.metadata;
//     res.send(metadata)
//   } catch (error) {
//     console.error('An error occurred: ', error);
//     res.status(500).send('Internal Server Error');
//   }
// }





module.exports = {
  // getDataFromAPI,
  // uploadDataToDO,
  renderPlaylist
}