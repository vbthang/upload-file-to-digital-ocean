'use strict'

const path = require('path');
const express = require('express')
const dotenv = require('dotenv')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config()

const port = process.env.DEV_PORT || 8001

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './src/views/')
app.set('view engine', 'ejs')

// USING MONGODB
require('./src/dbs/init.mongodb')

// ROUTE PLAYLIST
app.use('', require('./src/route'))

app.listen(port, () => {
  console.log(`App run on http://localhost:${port}`)
})