// @flow
import mongoose from 'mongoose';
import type { ObjectId } from 'mongoose';
import moment from 'moment';
import { pushTournamentUpdate } from '../realtime';
import type { ParticipantDbModel } from './participant';
import {
  schema as participantSchema,
  mapToDomainModel as mapParticipantToDomainModel,
  mapToDbModel as mapParticipantToDbModel
} from './participant';
import type { RoundDbModel } from './round';
import {
  schema as roundSchema,
  mapToDomainModel as mapRoundToDomainModel,
  mapToDbModel as mapRoundToDbModel
} from './round';

type TournamentModel = {
  _id: ObjectId,
  creatorId: ObjectId,
  name: string,
  date: Date,
  type: TournamentType,
  judges: Array<{ _id: ObjectId, name: string }>,
  participants: Array<ParticipantDbModel>,
  rounds: Array<RoundDbModel>,
  dancesNoted: { [judgeId: string]: Array<string> }
};

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const schema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  prevAttendanceId: {
    type: Number,
    required: true,
    default: 0
  },
  judges: [judgeSchema],
  participants: [participantSchema],
  rounds: [roundSchema],
  dancesNoted: mongoose.Schema.Types.Mixed
});

const Model = mongoose.model('tournament', schema);

export interface TournamentRepository {
  create(tournament: Tournament): Promise<void>;
  get(id: string): Promise<?Tournament>;
  getAll(): Promise<Array<Tournament>>;
  getForUser(userId: string): Promise<Array<Tournament>>;
  getForJudge(judgeId: string): Promise<?Tournament>;
  update(tournament: Tournament): Promise<void>;
  updateParticipantAttendance(
    participantId: string,
    isAttending: boolean
  ): Promise<?Participant>;

  createParticipant(
    tournamentId: string,
    participant: Participant
  ): Promise<void>;

  createRound(tournamentId: string, round: Round): Promise<void>;
  deleteRound(tournamentId: string, roundId: string): Promise<void>;
  updateRound(tournamentId: string, round: Round): Promise<void>;

  addJudge(tournamentId: string, judge: Judge): Promise<void>;
  markDanceAsNoted(
    tournamentId: string,
    judgeId: string,
    danceId: string
  ): Promise<void>;
}

export class TournamentRepositoryImpl implements TournamentRepository {
  async create(tournament: Tournament) {
    await Model.create(mapToDbModel(tournament));
  }
  async get(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return mapToDomainModel((await Model.findOne({ _id: id })).toObject());
  }
  async getAll() {
    try {
      return (await Model.find()).map(o => mapToDomainModel(o.toObject()));
    } catch (e) {
      return [];
    }
  }
  async getForUser(userId: string) {
    try {
      return (await Model.find({ creatorId: userId })).map(o =>
        mapToDomainModel(o.toObject())
      );
    } catch (e) {
      return [];
    }
  }

  async getForJudge(judgeId: string) {
    try {
      return mapToDomainModel(
        (await Model.findOne({
          judges: { $elemMatch: { _id: judgeId } }
        })).toObject()
      );
    } catch (e) {
      return null;
    }
  }

  async update(tournament: Tournament) {
    // don't overwrite anything sensitive for now
    const { name, date } = mapToDbModel(tournament);
    await Model.update(
      { _id: tournament.id },
      {
        $set: { name, date }
      }
    );

    pushTournamentUpdate(tournament);
  }
  async createParticipant(tournamentId: string, participant: Participant) {
    const tournament = await Model.findOneAndUpdate(
      { _id: tournamentId },
      {
        $push: {
          participants: mapParticipantToDbModel(participant)
        }
      },
      { new: true }
    );

    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }
  async createRound(tournamentId: string, round: Round) {
    const tournament = await Model.findOneAndUpdate(
      { _id: tournamentId },
      {
        $push: {
          rounds: mapRoundToDbModel(round)
        }
      },
      { new: true }
    );
    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }
  async deleteRound(tournamentId: string, roundId: string) {
    const tournament = await Model.findOneAndUpdate(
      { _id: tournamentId },
      {
        $pull: {
          rounds: { _id: roundId }
        }
      }
    );
    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }

  async updateRound(tournamentId: string, round: Round) {
    const tournament = await Model.findOne({ _id: tournamentId });
    for (let i = 0; i < tournament.rounds.length; ++i) {
      if (tournament.rounds[i]._id.toString() === round.id) {
        const dbModel = mapRoundToDbModel(round);
        tournament.rounds[i] = dbModel;
        await tournament.save();
        break;
      }
    }

    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }

  async addJudge(tournamentId: string, judge: Judge) {
    const db = {
      _id: new mongoose.Types.ObjectId(judge.id),
      name: judge.name
    };
    const tournament = await Model.findOneAndUpdate(
      { _id: tournamentId },
      {
        $push: {
          judges: db
        }
      },
      { new: true }
    );
    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }

  async updateParticipantAttendance(
    participantId: string,
    isAttending: boolean
  ) {
    const participant = (await Model.findOne(
      {
        participants: { $elemMatch: { _id: participantId } }
      },
      { 'participants.$': 1 }
    )).participants[0];

    let attendanceId: ?number;
    if (isAttending && !participant.attendanceId) {
      attendanceId = (await Model.findOneAndUpdate(
        { participants: { $elemMatch: { _id: participantId } } },
        { $inc: { prevAttendanceId: 1 } },
        { new: true }
      )).prevAttendanceId;
    } else {
      attendanceId = participant.attendanceId;
    }

    const tournament = await Model.findOneAndUpdate(
      { participants: { $elemMatch: { _id: participantId } } },
      {
        $set: {
          'participants.$.isAttending': isAttending,
          'participants.$.attendanceId': attendanceId
        }
      },
      { new: true }
    );

    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));

    return tournament
      .toObject()
      .participants.map(mapParticipantToDomainModel)
      .filter(({ id }) => id === participantId)[0];
  }

  async markDanceAsNoted(
    tournamentId: string,
    judgeId: string,
    danceId: string
  ) {
    const tournament = await Model.findOneAndUpdate(
      { _id: tournamentId },
      {
        $push: {
          [`dancesNoted.${judgeId}`]: danceId
        }
      },
      { new: true }
    );
    pushTournamentUpdate(mapToDomainModel(tournament.toObject()));
  }
}

function mapToDbModel(tournament: Tournament): TournamentModel {
  const {
    id,
    date,
    creatorId,
    participants,
    rounds,
    judges,
    ...same
  } = tournament;
  return {
    ...same,
    _id: new mongoose.Types.ObjectId(id),
    creatorId: new mongoose.Types.ObjectId(creatorId),
    date: date.toDate(),
    participants: participants.map(mapParticipantToDbModel),
    rounds: rounds.map(mapRoundToDbModel),
    judges: judges.map(j => ({
      name: j.name,
      _id: new mongoose.Types.ObjectId(j.id)
    }))
  };
}

function mapToDomainModel(tournament: TournamentModel): Tournament {
  const {
    _id,
    date,
    creatorId,
    participants,
    rounds,
    judges,
    ...same
  } = tournament;
  return {
    ...same,
    id: _id.toString(),
    creatorId: creatorId.toString(),
    date: moment(date),
    participants: participants.map(mapParticipantToDomainModel),
    rounds: rounds.map(mapRoundToDomainModel),
    judges: judges.map(j => ({
      name: j.name,
      id: j._id.toString()
    }))
  };
}

export default TournamentRepositoryImpl;
