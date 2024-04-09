'use strict'

const PlaylistService = require("../service/playlist.service")

class PlaylistControlller {
// RENDER UI
    index = async (req, res) => {
        res.render('playlist/index', {
            'categories': await PlaylistService.getAllCategories()
        })
    }

// DATA
    getPlaylistExists = async (req, res) => {
        const playlistExists = await PlaylistService.getAllPlaylistExists(req.query)
        res.json(playlistExists)
    }

    getAllSongOfCategory = async (req, res) => {
        const songs = await PlaylistService.getAllSongOfCategory(req.query)
        res.json(songs)
    }

    upload = async (req, res) => {
        const playlist = await PlaylistService.createOne(req.body)
        if(playlist) {
            res.status(200).json({
                msg: 'Upload successfully'
            })
        } else {
            res.status('400').json({
                msg: 'Try Again!'
            })
        }
    }
}

module.exports = new PlaylistControlller()