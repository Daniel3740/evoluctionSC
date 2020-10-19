require("dotenv").config();
const knex = require('./knex/knex.js');
const express = require('express');
const http = require('http')
const path = require('path')
const cors = require('cors')



const app = express()
app.use( express.json() );
const server = http.createServer(app)
const port = process.env.PORT || 3030
const publicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(publicDirectoryPath))
app.use(cors())

// Route
app.use( '/api/login', require('./routes/usuario') );




server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})