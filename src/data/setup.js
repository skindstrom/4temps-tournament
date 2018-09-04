// @flow
import mongoose from 'mongoose';

const OPTIONS = { useMongoClient: true, poolSize: 5 };
mongoose.Promise = global.Promise;
mongoose.connect(
  String(process.env.DB_URI),
  OPTIONS
);

export function disconnect() {
  mongoose.disconnect();
}

export default () => {
  return mongoose.connection;
};
