const { default: mongoose } = require('mongoose');

function dbConfig() {
  mongoose
    .connect(process.env.db_URL)
    .then(() => {
      console.log('Database connected');
    })
    .catch(err => {
      console.log('Database connection error:', err);
    });
}

module.exports = dbConfig;
