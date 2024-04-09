'use strict'

const express = require('express')
const PlaylistController = require('../../controllers/playlist.controller')
const router = express.Router()

router.get('', PlaylistController.index)
router.get('/index', PlaylistController.index)
router.get('/getPlaylistExists', PlaylistController.getPlaylistExists)
router.get('/getAllSongOfCategory', PlaylistController.getAllSongOfCategory)
router.post('/upload', PlaylistController.upload)

module.exports = router