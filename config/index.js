var env = process.env.NODE_ENV || 'development';
console.log('current env: ' + env)
var config = {
  development: {
    host: 'localhost',
    app_port: process.env.PORT || 3000,
    jwt_secret_token: 'claveseguratokens',
    db_port: 5432,
    db_username: 'postgres',
    db_password: 'postgres',
    multer_path: './data/'
  },
  staging: {
    host: 'localhost',
    app_port: process.env.PORT || 3000,
    jwt_secret_token: 'claveinseguratokens',
    db_port: 5432,
    db_username: 'postgres',
    db_password: 'postgres',
    multer_path: './data/'
  },
  production: {
    host: 'localhost',
    app_port: process.env.PORT || 3000,
    jwt_secret_token: process.env.jwt_secret_token,
    db_port: 5432,
    db_username: process.env.db_username,
    db_password: process.env.db_password,
    multer_path: './data/'
  }
};

module.exports = config[env];