// @flow
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/4temps', { useMongoClient: true })
  .catch(() => {
    // eslint-disable-next-line
    console.error('Could not connect to mongo database, shutting down...');
    process.exit(1);
  });

export type TokenModel = {
  _id: string,
  userId: string,
  tokens: Array<String>
}

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tokens: {
    type: [String],
    required: true
  },
});

const Model = mongoose.model('token', schema);

export const appendToken =
  async (userId: string, token: string): Promise<boolean> => {
    try {
      await Model.findOneAndUpdate({ userId },
        { $push: { tokens: token } }, { upsert: true });
      return true;
    } catch (e) {
      return false;
    }
  };

export default appendToken;