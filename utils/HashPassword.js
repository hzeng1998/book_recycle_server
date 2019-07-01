const bcrypt = require('bcrypt');
const { promisify } = require('util');

bcrypt.hashAsync = promisify(bcrypt.hash);
bcrypt.compareAsync = promisify(bcrypt.compare);

module.exports = bcrypt;