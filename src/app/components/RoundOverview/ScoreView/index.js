// @flow
import { connect } from 'react-redux';
import type { Props as ComponentProps, ScoreViewModel } from './component';
import Component from './component';

type Props = {
  roundId: string
};

function mapStateToProps(
  { rounds, participants }: ReduxState,
  { roundId }: Props
): ComponentProps {
  const round = rounds.byId[roundId];
  const scores = hydrateScores(round.scores, participants);
  const scoresMap: { [id: string]: ScoreViewModel } = scores.reduce(
    (acc, score) => ({ ...acc, [score.participant.id]: score }),
    {}
  );

  const pairs = getPairs(round);

  const winningLeaders = new Set(round.winners.leaders);
  const winningFollowers = new Set(round.winners.followers);

  const losingLeaders = getLeaders(pairs).filter(id => !winningLeaders.has(id));
  const losingFollowers = getFollowers(pairs).filter(
    id => !winningFollowers.has(id)
  );

  const winningLeaderScores = round.winners.leaders.map((id, i) => ({
    ...scoresMap[id],
    position: i + 1
  }));
  const winningFollowerScores = round.winners.followers.map((id, i) => ({
    ...scoresMap[id],
    position: i + 1
  }));

  return {
    isFinished: round.finished,
    winningLeaderScores,
    winningFollowerScores,
    losingLeaderScores: losingLeaders.map((id, i) => ({
      ...scoresMap[id],
      position: winningLeaderScores.length + i + 1
    })),
    losingFollowerScores: losingFollowers.map((id, i) => ({
      ...scoresMap[id],
      position: winningFollowerScores.length + i + 1
    }))
  };
}

function hydrateScores(
  scores: Array<Score>,
  participants: ParticipantsReduxState
) {
  return scores.map(score => ({
    score: score.score,
    participant: participants.byId[score.participantId]
  }));
}

function getPairs(round: Round): Array<Pair> {
  return round.groups.reduce((pairs, group) => [...pairs, ...group.pairs], []);
}

function getLeaders(pairs: Array<Pair>): Array<string> {
  return pairs.reduce(
    (acc, pair) => (pair.leader != null ? [...acc, pair.leader] : acc),
    []
  );
}

function getFollowers(pairs: Array<Pair>): Array<string> {
  return pairs.reduce(
    (acc, pair) => (pair.follower != null ? [...acc, pair.follower] : acc),
    []
  );
}

const ScoreViewContainer = connect(mapStateToProps)(Component);

export default ScoreViewContainer;
