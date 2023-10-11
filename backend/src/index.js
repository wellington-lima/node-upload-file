require('dotenv').config();
const express = require('express')
const routes = require('./routes.js')
const morgan = require('morgan')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use("/files", express.static(path.resolve(process.env.SERVER_FILE)))
app.use(routes)

app.get('/', (req, res) => {
  return res.send('Hello world!')
})

const port = process.env.API_PORT || 3000
app.listen(port, ()=> console.log(`Server started on port ${port}`))   