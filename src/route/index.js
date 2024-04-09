'use strict'

const express = require('express');
const router = express.Router();

router.use('/category', require('./category'))
router.use('/playlist', require('./playlist'))

module.exports = router;
