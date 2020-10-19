const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration);           // define database based on above
 
 //get user
 const getUsers = (request, response) => {
     console.log(request.body)
    usersDB()
    .then((users) => response.status(200).json(users))
    .catch((err) => response.status(500).json({error:err}))
  }

  //get user DB
  const usersDB = async () => {
    const data = await database.raw("SELECT id, username, lastname, estado FROM users")
    return data.rows;
  }

  module.exports = {
    getUsers
}