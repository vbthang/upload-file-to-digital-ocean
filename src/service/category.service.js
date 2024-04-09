'use strict'

const aws = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const https = require('https');
const playlistModel = require('../model/playlist.model');
const categoryModel = require('../model/category.model');

class CategoryService {
    static CATEGORIES_SELECTED = process.env.CATEGORIES_SELECTED.split(',').map(Number);

    static getAll = async () => {
        const response = await axios.get(`${process.env.SERVER_API_PLAYLIST}`);

        const categories = response.data.metadata.reduce((acc, category) => {
          return acc.concat(category.items);
        }, []);
        
        const categories_selected = CategoryService.CATEGORIES_SELECTED.map(index => categories[index]);
        
        // categories_selected.forEach(async (c) => {
        //     const songs = await CategoryService.getAllSongOfCategory({ 
        //         categoryId: c.id 
        //     })
        //     const songExists = await songs.reduce(async (acc, s) => {


        //         return acc
        //     }, [])
        //     console.log(songExists);
        // })
        




        return categories_selected
    }

    static store = async ({
        category_id,
        category_title,
        category_thumbnail,
        category_backcolor,
    }) => {
        const newCate = await categoryModel.create({
            category_id,
            category_title,
            category_thumbnail,
            category_backcolor
        })
        return newCate
    }

    static getAllSongOfCategory = async ({ categoryId }) => {
        const response = await axios.get(`${process.env.SERVER_API_PLAYLIST_INFO}/${categoryId}`);
        const songs = response.data.metadata
        return songs
    }
}

module.exports = CategoryService