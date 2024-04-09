'use strict'

const express = require('express')
const CategoryController = require('../../controllers/category.controller')
const router = express.Router()

router.get('/getAll', CategoryController.getAll)
router.post('/store', CategoryController.store)

module.exports = router