// @flow

export interface GroupGenerator {
  generateGroups(): Array<Array<Pair>>;
}

export default class GroupGeneratorImpl implements GroupGenerator {
  _round: Round;
  _participants: Set<Participant>;

  _leaderCount: number = 0;
  _followerCount: number = 0;
  _bothCount: number = 0;

  constructor(round: Round, participants: Array<Participant>) {
    this._round = round;
    this._participants = new Set(participants);
  }

  generateGroups = () => {
    this._removeAbsentParticipants();
    this._updateCounts();

    const groups: Array<Array<Pair>> = [];

    let i = 0;
    while (this._participants.size > 0) {
      groups.push(this._generateGroup(i++));
    }

    this._balanceUntilMinPairFulfilled(groups);

    return groups;
  };

  _removeAbsentParticipants = () => {
    this._participants = new Set(
      Array.from(this._participants).filter(p => p.isAttending)
    );
  };

  _updateCounts = () => {
    this._leaderCount = 0;
    this._followerCount = 0;
    this._bothCount = 0;

    for (const p of this._participants) {
      switch (p.role) {
      case 'leader':
        ++this._leaderCount;
        break;
      case 'follower':
        ++this._followerCount;
        break;
      case 'leaderAndFollower':
        ++this._bothCount;
        break;
      }
    }
  };

  _generateGroup = (index: number): Array<Pair> => {
    const group: Array<Pair> = [];
    let didSetNullParticipant = false;
    while (
      this._participants.size > 0 &&
      group.length < this._round.maxPairCountPerGroup
    ) {
      // $FlowFixMe
      const p1: Participant = this._getFirstParticipant();
      this._participants.delete(p1);

      const p2 = this._getParticipantWithParticipantRole(
        p1.role === 'leader' ? 'follower' : 'leader'
      );

      if (!didSetNullParticipant && index == 0 && p2 == null) {
        didSetNullParticipant = true;
        if (group.length > 0) {
          this._participants.add(p1);
          break;
        }
      }

      // $FlowFixMe
      this._participants.delete(p2);
      group.push(this._createPair(p1, p2));
      this._updateCounts();
    }

    return group;
  };

  _getFirstParticipant = () => {
    if (this._leaderCount > this._followerCount) {
      return this._randomUntilParticipantRole('leader');
    } else if (this._leaderCount < this._followerCount) {
      return this._randomUntilParticipantRole('follower');
    } else {
      return this._randomParticipant();
    }
  };

  _getParticipantWithParticipantRole = (
    role: ParticipantRole
  ): ?Participant => {
    switch (role) {
    case 'leader':
      return this._randomLeader();
    case 'follower':
      return this._randomFollower();
    case 'leaderAndFollower':
      return this._randomParticipant();
    default:
      throw 'Invalid role';
    }
  };

  _randomParticipant = () => {
    if (this._participants.size === 0) {
      return null;
    }
    const index = this._randomIndex();
    return Array.from(this._participants.values())[index];
  };

  _randomIndex = () => {
    const max = this._participants.size;
    return Math.floor(Math.random() * max);
  };

  _randomLeader = () => {
    if (this._leaderCount === 0) {
      return this._randomUntilParticipantRoleOrLeaderAndFollower('leader');
    }
    return this._randomUntilParticipantRole('leader');
  };

  _randomFollower = () => {
    if (this._followerCount === 0) {
      return this._randomUntilParticipantRoleOrLeaderAndFollower('follower');
    }
    return this._randomUntilParticipantRole('follower');
  };

  _randomUntilParticipantRole = (role: ParticipantRole) => {
    if (
      (role === 'leader' && this._leaderCount === 0) ||
      (role === 'follower' && this._followerCount === 0)
    ) {
      return null;
    }

    let participant: ?Participant;
    do {
      participant = this._randomParticipant();
    } while (participant && participant.role !== role);

    return participant;
  };

  _randomUntilParticipantRoleOrLeaderAndFollower = (role: ParticipantRole) => {
    if (
      (role === 'leader' && this._leaderCount + this._bothCount === 0) ||
      (role === 'follower' && this._followerCount + this._bothCount === 0)
    ) {
      return null;
    }

    let participant: ?Participant;
    do {
      participant = this._randomParticipant();
    } while (
      participant &&
      participant.role !== role &&
      participant.role !== 'leaderAndFollower'
    );

    return participant;
  };

  _createPair = (p1: ?Participant, p2: ?Participant) => {
    if (p1 == null && p2 != null) {
      if (p2.role === 'leader' || p2.role === 'leaderAndFollower') {
        return { follower: null, leader: p2.id };
      } else {
        return { follower: p2.id, leader: null };
      }
    } else if (p2 == null && p1 != null) {
      if (p1.role === 'leader' || p1.role === 'leaderAndFollower') {
        return { follower: null, leader: p1.id };
      } else {
        return { follower: p1.id, leader: null };
      }
    } else if (p1 != null && p2 != null) {
      if (p1.role === 'leader' || p1.role === 'leaderAndFollower') {
        return { leader: p1.id, follower: p2.id };
      } else {
        return { leader: p2.id, follower: p1.id };
      }
    }
    throw 'Both participants may not be null';
  };

  _balanceUntilMinPairFulfilled = (groups: Array<Array<Pair>>) => {
    if (groups.length >= 2) {
      const lastIndex = groups.length - 1;
      let i = groups.length - 2;
      while (
        groups[lastIndex].length < this._round.minPairCountPerGroup &&
        groups[lastIndex].length + 1 < groups[i].length
      ) {
        groups[lastIndex].push(groups[i].pop());
        i = i - 1;
        if (i < 0) {
          i = lastIndex - 1;
        }
      }
    }
  };
}
