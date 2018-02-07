// @flow

import mongoose from 'mongoose';
import type {ObjectId} from 'mongoose';
import crypto from 'crypto';

type AccessKeyDbModel = {
  _id: ObjectId,
  tournamentId: ObjectId,
  userId: ObjectId,
  key: string,
}

const schema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  key: {
    type: String,
    required: true
  }
});

const Model = mongoose.model('accessKey', schema);

export interface AccessKeyRepository {
  createForTournamentAndUser(
    tournamentId: string, userId: string): Promise<void>;
  getForKey(key: string): Promise<?AccessKey>;
  getForTournament(id: string): Promise<Array<AccessKey>>;
}

class AccessKeyRepositoryImpl implements AccessKeyRepository {
  async createForTournamentAndUser(
    tournamentId: string, userId: string) {
    const key = await this._generateUniqueKey();
    /*
     * There's a race condition between the generation of the key
     * and the insert. However, there will not be a lot of concurrent
     * inserts, and let's believe in the randomness for now
     */
    await Model.create({tournamentId, userId, key});
  }

  async _generateUniqueKey() {
    let key = this._generateKey();
    while ((await this.getForKey(key)) != null) {
      key = this._generateKey();
    }
    return key;
  }

  _generateKey() {
    return crypto.randomBytes(5).toString('hex');
  }

  async getForKey(key: string) {
    return this.mapToDomainModel(await Model.findOne({key}));
  }

  mapToDomainModel(dbModel: ?AccessKeyDbModel): ?AccessKey {
    if (!dbModel) {
      return null;
    }

    const {key, userId, tournamentId} = dbModel;
    return {
      key,
      userId: userId.toString(),
      tournamentId: tournamentId.toString()
    };
  }

  async getForTournament(tournamentId: string) {
    const found = await Model.find({ tournamentId });
    if (found) {
      return found.map(o => this.mapToDomainModel(o.toObject()));
    }
    return [];
  }
}

export default AccessKeyRepositoryImpl;
