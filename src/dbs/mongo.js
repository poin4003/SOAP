const mongoose = require('mongoose');

class Mongo {
  constructor() {
    this._connect();
  }
  _connect() {
    console.log("\x1b[33m%s\x1b[0m", "URI: ", 'mongodb://localhost:27017/bookstore');
    mongoose.connect('mongodb://localhost:27017/studentDB').then(() => {
      console.info('\x1b[32mSUCCESS:\x1b[0m Connected to \x1b[36mMongoDB\x1b[0m');
    }).catch((error) => {
      console.error('\x1b[31mFAILED:\x1b[0m Can\'t connect to MongoDB: ', error);
    });
  }
}

module.exports = new Mongo();