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

  constructor(tournament: Tournament, notes: Array<JudgeNote>) {
    this._tournament = tournament;
    this._notes = notes;
  }

  generateForRound = (roundId: string): ?DanceGroup => {
    this._round = this._getRound(roundId);
    this._roundParticipants = this._getParticipants();

    return this._generateGroup();
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
        return [
          ...prevRound.winners.leaders,
          ...prevRound.winners.followers
          // $FlowFixMe
        ].map(id => this._tournament.participants.find(p => p.id === id));
      }
      prevRound = round;
    }
    throw new RoundNotFoundError();
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
          pairs = null;
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
    let worst = this._getParticipantWithWorstScore(
      this._getScoresOfParticipantsWithRole(role).filter(
        ({ participantId }) => !excludeIds.has(participantId)
      )
    );
    if (worst == null) {
      worst = this._getRandomParticipantWithRole(role);
    }
    return this._getParticipantWithId(worst);
  };

  _getScoresOfParticipantsWithRole = (role: Role): Array<Score> => {
    const participants = this._getParticipantsWithRole(role);

    const scorer = new RoundScorer(this._round);
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

  _getParticipantWithWorstScore = (scores: Array<Score>): ?string => {
    if (scores.length === 0) {
      return null;
    }
    return scores.sort((a, b) => a.score - b.score).reverse()[0].participantId;
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
}

function RoundNotFoundError() {}
function ParticipantNotFoundError() {}
function NoEvenPairingError() {}
