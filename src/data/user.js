// @flow
import mongoose from 'mongoose';
import type { User, UserWithPassword } from '../models/user';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/4temps', { useMongoClient: true })
  .catch(() => {
    // eslint-disable-next-line
    console.error('Could not connect to mongo database, shutting down...');
    process.exit(1);
  });

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

const UserModel = mongoose.model('user', schema);

export const createUser = async (user: UserWithPassword): Promise<boolean> => {
  const dbUser = new UserModel(user);
  try {
    await dbUser.save();
    return true;
  } catch (e) {
    return false;
  }
};

export const getUsers = async (): Promise<Array<User>> => {
  const users = await UserModel.find();
  return users.map(user => {
    const { firstName, lastName, email } = user;
    return { firstName, lastName, email };
  });
}