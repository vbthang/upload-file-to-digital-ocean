'use strict'

const axios = require('axios');
const playlistModel = require('../model/playlist.model');
const categoryModel = require('../model/category.model');
const songModel = require('../model/song.model');
const { v4: uuidv4 } = require('uuid');
const { putFileToDO } = require('../utils');

class PlaylistService {
    static CATEGORIES_SELECTED = process.env.CATEGORIES_SELECTED.split(',').map(Number);

    static generatePlaylistId() {
        return uuidv4();
    }

    static getAllCategories = async () => {
        const response = await axios.get(`${process.env.SERVER_API_PLAYLIST}`);

        const categories = response.data.metadata.reduce((acc, category) => {
          return acc.concat(category.items);
        }, []);

        return PlaylistService.CATEGORIES_SELECTED.map(index => categories[index]);
    }

    static getAllPlaylistExists = async ({ categoryId }) => {
        if(categoryId) {
            const category = await categoryModel.findOne({ category_id: categoryId });
            if(category) {
                const playlistIds = category.category_playlists;
                const playlists = await playlistModel.find({ playlist_id: { $in: playlistIds } });
                const playlistTitles = playlists.map(playlist => playlist.playlist_title);
                return playlistTitles;
            }
        }
        return []
    }

    static getAllSongOfCategory = async ({ categoryId }) => {
        const response = await axios.get(`${process.env.SERVER_API_PLAYLIST_INFO}/${categoryId}`);
        const songs = response.data.metadata
        return songs
    }

    static createOne = async ({ title, image, description, songIds, categoryId }) => {
        try {
            const playlist = await playlistModel.findOne({ playlist_title: title });
            if (!playlist) {
                const category = await categoryModel.findOne({ category_id: categoryId });
    
                // Lọc songIds
                const idsArray = songIds.split(',');

                const validIds = await idsArray.reduce(async (accumulatorPromise, id) => {
                    const accumulator = await accumulatorPromise;
                    const song = await songModel.findOne({ song_id: id.trim() });
                    if (song) {
                        accumulator.push(id.trim());
                    }
                    return accumulator;
                }, Promise.resolve([]));

                if (category) {
                    const id = PlaylistService.generatePlaylistId();
                    await putFileToDO({
                        pathSpace: process.env.DO_PLAYLIST_THUMBNAIL,
                        fileName: image,
                        type: 'image/jpeg'
                    });
    
                    const playlistUrl = `${process.env.DO_DOMAIN}\\${process.env.DO_PLAYLIST_THUMBNAIL}\\${image}`;
                    
                    const newPlaylist = await playlistModel.create({
                        playlist_id: id,
                        playlist_title: title,
                        playlist_description: description,
                        playlist_thumbnail: playlistUrl,
                        playlist_cover: playlistUrl,
                        playlist_songs: validIds
                    });
    
                    category.category_playlists.push(newPlaylist.playlist_id); 
                    await category.save(); 
    
                    return newPlaylist;
                } else {
                    console.log('Category not found');
                    return null;
                }
            } else {
                console.log('Playlist already exists');
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }       
}

module.exports = PlaylistService