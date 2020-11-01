var config = require('./config')

module.exports = {
   "type": "postgres",
   "host": config.host,
   "port": config.db_port,
   "username": config.db_username,
   "password": config.db_password,
   "database": "carpeta-ciudadana",
   "synchronize": true,
   "logging": false,
   "entities": [
      "dist/models/**/*.js"
   ]
}