// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export type AdminModel = {
  _id: ObjectId,
  email: string,
  firstName: string,
  lastName: string,
  password: string
};

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
  }
});

const Model = mongoose.model('admin', schema);

export const createAdmin = async (
  admin: AdminWithPassword
): Promise<boolean> => {
  admin.password = (await bcrypt.hash(admin.password, SALT_ROUNDS): string);
  const dbAdmin = new Model(admin);
  try {
    await dbAdmin.save();
    return true;
  } catch (e) {
    return false;
  }
};

export const getAdmins = async (): Promise<Array<AdminModel>> => {
  return await Model.find();
};

export const getAdminFromId = async (
  adminId: ObjectId
): Promise<?AdminModel> => {
  try {
    return await Model.findOne({ _id: adminId });
  } catch (e) {
    return null;
  }
};

export const getAdminFromCredentials = async (
  credentials: AdminCredentials
): Promise<?AdminModel> => {
  const admin = await Model.findOne({ email: credentials.email });
  if (
    admin != null &&
    (await bcrypt.compare(credentials.password, admin.password)) === true
  ) {
    return admin;
  }
  return null;
};

export function mapToDomainModel(admin: AdminModel): Admin {
  const { _id, password, ...same } = admin;
  return {
    id: _id.toString(),
    ...same
  };
}
