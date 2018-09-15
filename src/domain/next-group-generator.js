// @flow

import ObjectId from 'bson-objectid';
import PairingGeneratorImpl from './group-pairing-generator';
import RoundScorer from './round-scorer';

type Role = 'leader' | 'follower';

export default class NextGroupGenerator {
  _tournament: Tournament;
  _notes: Array<JudgeNote>;

  _round: Round;
  _roundParticipants: Array<Participant>;
  _removeUneven: boolean = false;

  constructor(tournament: Tournament, notes: Array<JudgeNote>) {
    this._tournament = tournament;
    this._notes = notes;
  }

  generateForRound = (roundId: string): ?DanceGroup => {
    this._round = this._getRound(roundId);
    this._roundParticipants = this._getParticipants();

    return this._generateGroup();
  };

  removeUneven = () => {
    this._removeUneven = true;
  };

  _getRound = (roundId: string): Round => {
    const roundsWithId = this._tournament.rounds.filter(
      ({ id }) => id === roundId
    );
    if (roundsWithId.length === 0) {
      throw new RoundNotFoundError();
    }
    return roundsWithId[0];
  };

  _getParticipants = (): Array<Participant> => {
    let participants: Array<Participant>;
    if (this._hasPreviousRound()) {
      participants = this._getWinnersOfPreviousRound();
    } else {
      participants = this._tournament.participants;
    }
    return participants.filter(par => par.isAttending);
  };

  _hasPreviousRound = () => {
    return this._tournament.rounds[0].id !== this._round.id;
  };

  _getWinnersOfPreviousRound = (): Array<Participant> => {
    let prevRound: ?Round = null;
    for (const round of this._tournament.rounds) {
      if (round.id === this._round.id && prevRound != null) {
        const winners = this._getWinnersOfRound(prevRound);
        return (
          winners
            // $FlowFixMe
            .map(id => this._tournament.participants.find(p => p.id === id))
        );
      }
      prevRound = round;
    }
    throw new RoundNotFoundError();
  };

  _getWinnersOfRound = (round: Round): Array<string> => {
    const leaders = [];
    const followers = [];
    for (const group of round.groups) {
      for (const pair of group.pairs) {
        leaders.push(pair.leader);
        followers.push(pair.follower);
      }
    }

    const leaderSet = new Set(leaders);
    const followerSet = new Set(followers);

    const isAttending = this._tournament.participants.reduce((acc, par) => {
      acc[par.id] = par.isAttending;
      return acc;
    }, {});

    const count = round.passingCouplesCount;
    const passingLeaders = round.scores
      .map(({ participantId }) => participantId)
      .filter(id => isAttending[id] && leaderSet.has(id))
      .slice(0, count);
    const passingFollowers = round.scores
      .map(({ participantId }) => participantId)
      .filter(id => isAttending[id] && followerSet.has(id))
      .slice(0, count);

    // $FlowFixMe
    return passingLeaders.concat(passingFollowers);
  };

  _generateGroup = (): ?DanceGroup => {
    const remainingParticipants = this._getRemainingParticipants();
    if (remainingParticipants.length === 0) {
      return null;
    }

    let pairs = this._generatePairsFromParticipants(remainingParticipants);
    if (this._isUnevenPairing(pairs)) {
      try {
        pairs = this._makeEvenPairing();
      } catch (e) {
        if (e instanceof NoEvenPairingError) {
          if (this._removeUneven) {
            pairs = pairs.filter(
              ({ leader, follower }) => leader != null && follower != null
            );
          } else {
            pairs = null;
          }
        } else {
          throw e;
        }
      }
    }

    if (pairs == null) {
      return null;
    }

    return {
      id: ObjectId.generate(),
      pairs,
      dances: this._createDances(this._round.danceCount)
    };
  };

  _getRemainingParticipants = (): Array<Participant> => {
    const alreadyDancedParticipants = new Set(
      this._getAlreadyCompetedParticipants()
    );

    return this._roundParticipants.filter(
      par => !alreadyDancedParticipants.has(par.id)
    );
  };

  _getAlreadyCompetedParticipants = (): Array<string> => {
    const participants: Array<string> = [];
    for (const group of this._round.groups) {
      for (const pair of group.pairs) {
        if (pair.leader != null) {
          participants.push(pair.leader);
        }
        if (pair.follower != null) {
          participants.push(pair.follower);
        }
      }
    }

    return participants;
  };

  _generatePairsFromParticipants = (participants: Array<Participant>) => {
    const generator = new PairingGeneratorImpl(this._round, participants);

    return generator.generateGroups()[0];
  };

  _isUnevenPairing = (pairs: Array<{ follower: ?string, leader: ?string }>) => {
    const counts = this._roleCounts(pairs);

    return counts.leader !== counts.follower;
  };

  _makeEvenPairing = () => {
    const remainingParticipants = this._getRemainingParticipants();

    let pairs = this._generatePairsFromParticipants(remainingParticipants);

    while (this._isUnevenPairing(pairs)) {
      if (remainingParticipants.length === this._roundParticipants.length) {
        throw new NoEvenPairingError();
      }

      const roleCounts = this._roleCounts(pairs);
      if (roleCounts.leader < roleCounts.follower) {
        remainingParticipants.push(
          this._getLeaderWithWorstFollower(remainingParticipants)
        );
      } else {
        remainingParticipants.push(
          this._getFollowerWithWorstLeader(remainingParticipants)
        );
      }

      pairs = this._generatePairsFromParticipants(remainingParticipants);
    }

    return pairs;
  };

  _roleCounts = (pairs: Array<{ follower: ?string, leader: ?string }>) => {
    return pairs.reduce(
      (acc, pair) => ({
        follower: acc.follower + (pair.follower != null ? 1 : 0),
        leader: acc.leader + (pair.leader != null ? 1 : 0)
      }),
      { leader: 0, follower: 0 }
    );
  };

  _getFollowerWithWorstLeader = (
    excluding: Array<Participant>
  ): Participant => {
    return this._getParticipantWithWorstCounterpart('follower', excluding);
  };

  _getLeaderWithWorstFollower = (
    excluding: Array<Participant>
  ): Participant => {
    return this._getParticipantWithWorstCounterpart('leader', excluding);
  };

  _getParticipantWithWorstCounterpart = (
    role: Role,
    excluding: Array<Participant>
  ): Participant => {
    const excludeIds = new Set(excluding.map(({ id }) => id));
    const worstParticipants = this._getScoresOfParticipantsWithRole(
      role === 'leader' ? 'follower' : 'leader'
    )
      .map(({ participantId }) => participantId)
      .reverse();

    let counterPart: string = '';
    for (const worstId of worstParticipants) {
      counterPart = this._getCounterPartOf(worstId);
      if (
        !excludeIds.has(counterPart) &&
        !this._didDanceMoreThanOthers(counterPart)
      ) {
        break;
      }
    }

    return this._getParticipantWithId(counterPart);
  };

  _getCounterPartOf = (participantId: string): string => {
    for (const group of this._round.groups) {
      const pair = group.pairs.find(pair => {
        return pair.follower === participantId || pair.leader === participantId;
      });
      if (pair != null) {
        if (pair.leader === participantId) {
          // $FlowFixMe
          return pair.follower;
        } else {
          // $FlowFixMe
          return pair.leader;
        }
      }
    }

    throw new ParticipantNotFoundError();
  };

  _getScoresOfParticipantsWithRole = (role: Role): Array<Score> => {
    const participants = this._getParticipantsWithRole(role);

    const scorer = new RoundScorer(this._tournament.judges, this._round);
    const scores = scorer.scoreRound(this._notes);

    return scores.filter(score => participants.has(score.participantId));
  };

  _getParticipantsWithRole = (role: Role): Set<string> => {
    return new Set(
      this._round.groups.reduce(
        (participants, group) => [
          ...participants,
          ...group.pairs
            .map(pair => (pair[role] != null ? [pair[role]] : []))
            .reduce((acc, ids) => [...acc, ...ids], [])
            .filter(id => id != null)
        ],
        []
      )
    );
  };

  _getRandomParticipantWithRole = (role: Role): string => {
    const participants = Array.from(this._getParticipantsWithRole(role));
    return participants[Math.floor(Math.random() * participants.length)];
  };

  _getParticipantWithId = (participantId: string): Participant => {
    const participantsWithId = this._roundParticipants.filter(
      ({ id }) => id === participantId
    );
    if (participantsWithId.length !== 1) {
      throw new ParticipantNotFoundError();
    }

    return participantsWithId[0];
  };

  _createDances = (danceCount: number) => {
    let dances: Array<Dance> = [];
    for (let i = 0; i < danceCount; ++i) {
      dances.push({ id: ObjectId.generate(), active: false, finished: false });
    }
    return dances;
  };

  _didDanceMoreThanOthers = (participantId: string) => {
    const { leaders, followers } = this._getDanceCountPerParticipant();
    if (participantId in leaders) {
      return (
        leaders[participantId] >
        Math.min(...Object.keys(leaders).map(id => leaders[id]))
      );
    } else {
      return (
        followers[participantId] >
        Math.min(...Object.keys(followers).map(id => followers[id]))
      );
    }
  };

  _getDanceCountPerParticipant = (): {
    leaders: { [id: string]: number },
    followers: { [id: string]: number }
  } => {
    return this._round.groups.reduce(
      (acc, group) => {
        for (const pair of group.pairs) {
          // $FlowFixMe
          if (acc.leaders[pair.leader]) {
            acc.leaders[pair.leader] += 1;
          } else {
            // $FlowFixMe
            acc.leaders[pair.leader] = 1;
          }
          // $FlowFixMe
          if (acc.followers[pair.follower]) {
            acc.followers[pair.follower] += 1;
          } else {
            // $FlowFixMe
            acc.followers[pair.follower] = 1;
          }
        }

        return acc;
      },
      { leaders: {}, followers: {} }
    );
  };
}

function RoundNotFoundError() {}
function ParticipantNotFoundError() {}
function NoEvenPairingError() {}
