const { MongoClient } = require("mongodb");
require("dotenv").config();
const state = {
  db: null,
};

module.exports.connect = async function () {
  // const url =  process.env.mongoURL;
  const url = "mongodb://localhost:27017";
  const dbname = "Melocia"

  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(url)
    state.db = client.db(dbname);
    console.log("database connected");
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error}`);
  }
};

module.exports.get = function () {
  return state.db;
};
