const db = require('./db');
db.sequelize.sync({ force: true });