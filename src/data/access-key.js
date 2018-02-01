// @flow

import mongoose from 'mongoose';
import type {ObjectId} from 'mongoose';
import crypto from 'crypto';

type AccessKeyDbModel = {
  _id: ObjectId,
  userId: ObjectId,
  key: string,
}

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  key: {
    type: String,
    required: true
  }
});

const Model = mongoose.model('accessKey', schema);

export interface AccessKeyRepository {
  createForUser(userId: string): Promise<void>;
  getForKey(key: string): Promise<?AccessKey>;
}

class AccessKeyRepositoryImpl implements AccessKeyRepository {
  async createForUser(userId: string) {
    const key = this._generateUniqueKey();
    /*
     * There's a race condition between the generation of the key
     * and the insert. However, there will not be a lot of concurrent
     * inserts, and let's believe in the randomness for now
     */
    await Model.insert({userId, key});
  }

  async _generateUniqueKey() {
    let key = this._generateKey();
    while ((await this.getForKey(key)) != null) {
      this._generateKey();
    }
    return key;
  }

  _generateKey() {
    return crypto.randomBytes(5).toString('hex');
  }

  async getForKey(key: string) {
    return this.mapToDomainModel(Model.findOne({key}));
  }

  mapToDomainModel(dbModel: ?AccessKeyDbModel): ?AccessKey {
    if (!dbModel) {
      return null;
    }

    const {key, userId} = dbModel;
    return {key, userId: userId.toString()};
  }
}

export default AccessKeyRepositoryImpl;
