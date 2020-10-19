// Update with your config settings.

module.exports = {

    development: {
      client: 'pg',
      connection: {
        host : 'localhost',
        user : 'postgres',
        password : 'DB_PASSWORD',
        database : 'DB_DATABASE',
        charset: 'utf8',
        port: 5433
      },
      migrations: {
        directory: __dirname + '/knex/migrations',
      },
      seeds: {
        directory: __dirname + '/knex/seeds'
      }
    },
  
    production: {
      client: 'pg',
      connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
        charset: 'utf8',
        port: process.env.DB_PORT
      },
      migrations: {
        directory: __dirname + '/knex/migrations',
      },
      seeds: {
        directory: __dirname + '/knex/seeds'
      }
    }
  
  };