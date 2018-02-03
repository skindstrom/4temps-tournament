// @flow
import type {Participant} from '../models/participant';

export interface GroupGenerator {
  generateGroups(): Array<Array<Pair>>;
}

export default class GroupGeneratorImpl implements GroupGenerator {
  _round: Round;
  _participants: Set<Participant>;

  constructor(round: Round, participants: Array<Participant>) {
    this._round = round;
    this._participants = new Set(participants);
  }

  generateGroups = () => {
    const groups: Array<Array<Pair>> = [];

    while (this._participants.size > 0) {
      groups.push(this._generateGroup());
    }

    this._balanceUntilMinPairFullfilled(groups);

    return groups;
  }

  _generateGroup = (): Array<Pair> => {

    const group: Array<Pair> = [];

    while (this._participants.size > 0
      && group.length < this._round.maxPairCount) {
      const p1 = this._randomParticipant();
      this._participants.delete(p1);

      let p2: ?Participant;
      if (this._participants.size === 0) {
        p2 = null;
      } else {
        p2 = this._getOtherParticipant(p1);
        this._participants.delete(p2);
      }

      group.push(this._createPair(p1, p2));
    }

    return group;
  }

  _getOtherParticipant = (first: Participant) => {
    switch(first.role) {
    case 'follower':
      return this._randomLeader();
    case 'leader':
      return this._randomFollower();
    case 'both':
      return this._randomParticipant();
    default:
      throw 'Invalid role';
    }
  }

  _randomParticipant = () => {
    const index = this._randomIndex();
    return Array.from(this._participants.values())[index];
  }

  _randomIndex = () => {
    const max = this._participants.size - 1;
    return Math.floor(Math.random() * Math.floor(max));
  }

  _randomLeader = () => {
    return this._randomUntilRole('leader');
  }

  _randomFollower = () => {
    return this._randomUntilRole('follower');
  }

  _randomUntilRole = (role: string) => {
    let participant: Participant;
    do {
      participant = this._randomParticipant();
    } while (participant.role !== role && participant.role !== 'both');

    return participant;
  }

  _createPair = (p1: ?Participant, p2: ?Participant) => {
    if (p1 == null && p2 != null) {
      if (p2.role === 'leader' || p2.role === 'both') {
        return {follower: null, leader: p2._id};
      } else {
        return {follower: p2._id, leader: null};
      }
    } else if (p2 == null && p1 != null) {
      if (p1.role === 'leader' || p1.role === 'both') {
        return {follower: null, leader: p1._id};
      } else {
        return {follower: p1._id, leader: null};
      }
    } else if (p1 != null && p2 != null) {
      if (p1.role === 'leader' || p1.role === 'both') {
        return {leader: p1._id, follower: p2._id};
      }  else {
        return {leader: p2._id, follower: p1._id};
      }
    }
    throw 'Both participants may not be null';
  }


  _balanceUntilMinPairFullfilled = (groups: Array<Array<Pair>>) => {
    if (groups.length >= 2) {
      const lastIndex = groups.length - 1;
      let i = groups.length - 2;
      while (groups[lastIndex].length < this._round.minPairCount
        && groups[lastIndex].length < groups[i].length) {

        groups[lastIndex].push(groups[i].pop());
        i = (i - 1);
        if (i < 0) {
          i = lastIndex - 1;
        }
      }
    }
  }
}
