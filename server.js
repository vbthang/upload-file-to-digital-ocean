const express = require('express')
const dotenv = require('dotenv')
const { getDataFromAPI, uploadDataToDO } = require('./src/controllers/data.controller')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
dotenv.config()

const port = process.env.DEV_PORT || 8000

app.set('views', './src/views/')
app.set('view engine', 'ejs')

app.get('/upload', uploadDataToDO)

app.post('/get-data', getDataFromAPI)

app.get('/', (req, res, next) => {
  res.render('home.ejs')
})


app.listen(port, () => {
  console.log(`App run on http://localhost:${port}`)
})