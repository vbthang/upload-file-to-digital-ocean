'use strict'

const CategoryService = require("../service/category.service")

class CategoryController {
    getAll = async (req, res) => {
        const playlistExists = await CategoryService.getAll()
        res.json(playlistExists)
    }

    store = async (req, res) => {
        const newCate = await CategoryService.store(req.body)
        res.json(newCate)
    }
}

module.exports = new CategoryController()