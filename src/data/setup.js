// @flow
import mongoose from 'mongoose';

const OPTIONS = { useMongoClient: true, poolSize: 5 };
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, OPTIONS);

export default () => {
  return mongoose.connection;
};