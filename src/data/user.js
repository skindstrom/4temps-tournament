// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import type { UserCredentials, UserWithPassword } from '../models/user';

const SALT_ROUNDS = 12;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/4temps', { useMongoClient: true })
  .catch(() => {
    // eslint-disable-next-line
    console.error('Could not connect to mongo database, shutting down...');
    process.exit(1);
  });

export type UserModel = {
  _id: ObjectId,
  email: string,
  firstName: string,
  lastName: string,
  password: string
}

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

const Model = mongoose.model('user', schema);

const createUser = async (user: UserWithPassword): Promise<boolean> => {
  user.password = ((await bcrypt.hash(user.password, SALT_ROUNDS)): string);
  const dbUser = new Model(user);
  try {
    await dbUser.save();
    return true;
  } catch (e) {
    return false;
  }
};

const getUsers = async (): Promise<Array<UserModel>> => {
  return await Model.find();
};

const getUserFromId = async (userId: ObjectId): Promise<?UserModel> => {
  try {
    return await Model.findOne({ _id: userId });
  } catch (e) {
    return null;
  }
};

const getUserFromCredentials =
  async (credentials: UserCredentials): Promise<?UserModel> => {
    const user = await Model.findOne({ email: credentials.email });
    if (user != null &&
      await bcrypt.compare(credentials.password, user.password) === true) {
      return user;
    }
    return null;
  };

module.exports = {
  createUser,
  getUsers,
  getUserFromId,
  getUserFromCredentials
};