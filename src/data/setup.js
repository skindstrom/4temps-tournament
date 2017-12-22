// @flow
import mongoose from 'mongoose';

const DB_URI = 'mongodb://localhost/4temps';
const OPTIONS = { useMongoClient: true, poolSize: 5 };
mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, OPTIONS);

export default () => {
  return mongoose.connection;
};