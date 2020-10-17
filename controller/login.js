const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../knexfile')[environment];   // pull in correct db with env configs
const database        = require('knex')(configuration);           // define database based on above
const bcrypt          = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto          = require('crypto')                         // built-in encryption node module


const signup = (request, response) => {
    const user = request.body
    findUserBD(user.username)
    .then(data =>{
      if(data===undefined){
        hashPassword(user.password)
        .then((hashedPassword) => {
          delete user.password
          user.password_digest = hashedPassword
        })
        .then(() => createToken())
        .then(token => user.token = token)
        .then(() => createUser(user))
        .then(user => {
          delete user.password_digest
          response.status(201).json({ user })
        })
        .catch((err) => console.error(err))
      }else{
        response.status(301).json({ err:'Usuario ya existe' })
      }
    })
  
  }

  const signin = (request, response) => {
    const userReq = request.body
    let user
    findUserBD(userReq)
    .then(foundUser => {
        user = foundUser
        return checkPassword(userReq.password, foundUser)
      })
      .then(() => createToken())
      .then(token => updateUserToken(token, user))
      .then(() => {
        response.status(200).json(user)
        delete user.password_digest
      })
      .catch((err) => response.status(500).json({error:err}))
    
  }



//Create user db
const createUser = async (user) => {
    const data = await database.raw(
        "INSERT INTO users (username, email, password, creation_date, token) VALUES (?, ?, ?, ?) RETURNING id, username, creation_date, token",
        [user.username, user.email, user.password_digest, new Date(), user.token,]
      );
      return data.rows[0];
  }

//check user in db
const findUserBD = async (userReq) =>  {
    const data = await database.raw("SELECT * FROM users WHERE username = ?", [userReq]);
    return data.rows[0];
  }


// check out bcrypt's docs for more info on their hashing function
const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    )
  }

// crypto ships with node - we're leveraging it to create a random, secure token
  const createToken = () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, data) => {
        err ? reject(err) : resolve(data.toString('base64'))
      })
    })
  }

  const checkPassword = (reqPassword, foundUser) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(reqPassword, foundUser.password_digest, (err, response) => {
          if (err) {
            reject(err)
          }
          else if (response) {
            resolve(response)
          } else {
            reject(new Error('Passwords no coinciden.'))
          }
      })
    )
  }

  //UPDATE token
  const updateUserToken = async (token, user) => {
    const data = await database.raw("UPDATE users SET token = ? WHERE id = ?", [token, user.id]);
      return data.rows[0];
  }


module.exports = {
    signup,
    signin
}