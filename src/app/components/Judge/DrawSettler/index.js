// @flow

import { connect } from 'react-redux';

import { settleDraw } from '../../../api/round';
import DrawSettler from './component';
import type {
  Props as ComponentProps,
  ActionProps as ComponentActionProps
} from './component';

type HydratedScore = { score: number, participant: Participant };

function mapStateToProps({
  participants,
  tournaments,
  rounds
}: ReduxState): ComponentProps {
  const tournament = tournaments.byId[tournaments.forJudge];

  // $FlowFixMe
  const activeRound: Round = tournament.rounds
    .map(roundId => rounds.byId[roundId])
    .find(round => round.active);

  const participantsOfRound = getParticipants(
    participants,
    tournaments.forJudge
  );
  const leaders = getParticipantsWithRole(
    'leader',
    activeRound,
    participantsOfRound
  );
  const hydratedLeaderScores = hydrateScores(leaders, activeRound.roundScores);

  const followers = getParticipantsWithRole(
    'follower',
    activeRound,
    participantsOfRound
  );
  const hydratedFollowerScores = hydrateScores(
    followers,
    activeRound.roundScores
  );

  return {
    isPairRound:
      tournament.rounds.indexOf(activeRound.id) ===
        tournament.rounds.length - 1 || tournament.type === 'classic',
    roundName: activeRound.name,
    passingCouplesCount: activeRound.passingCouplesCount,
    leaders: {
      winners: winningScores(
        activeRound.passingCouplesCount,
        hydratedLeaderScores
      ),
      draw: drawScores(activeRound.passingCouplesCount, hydratedLeaderScores),
      losers: loserScores(activeRound.passingCouplesCount, hydratedLeaderScores)
    },
    followers: {
      winners: winningScores(
        activeRound.passingCouplesCount,
        hydratedFollowerScores
      ),
      draw: drawScores(activeRound.passingCouplesCount, hydratedFollowerScores),
      losers: loserScores(
        activeRound.passingCouplesCount,
        hydratedFollowerScores
      )
    }
  };
}

function getParticipants(
  participants: ParticipantsReduxState,
  tournamentId: string
): Array<Participant> {
  return participants.forTournament[tournamentId].map(
    participantId => participants.byId[participantId]
  );
}

function getParticipantsWithRole(
  role: 'leader' | 'follower',
  round: Round,
  participants: Array<Participant>
): Array<Participant> {
  return round.groups
    .reduce((pairs, group) => [...pairs, ...group.pairs], [])
    .reduce((leaders, pair) => [...leaders, pair[role]], [])
    .map(participantId =>
      participants.find(participant => participant.id === participantId)
    )
    .filter(Boolean);
}

function winningScores(
  passingCouplesCount: number,
  scores: Array<HydratedScore>
) {
  if (scores.length <= passingCouplesCount) {
    return scores;
  }

  const lastWinnerScore = scores[passingCouplesCount - 1].score;
  return scores.filter(score => score.score > lastWinnerScore);
}

function drawScores(passingCouplesCount: number, scores: Array<HydratedScore>) {
  if (scores.length <= passingCouplesCount) {
    return [];
  }

  const lastWinnerScore = scores[passingCouplesCount - 1].score;
  return scores.filter(score => score.score === lastWinnerScore);
}

function loserScores(
  passingCouplesCount: number,
  scores: Array<HydratedScore>
) {
  if (scores.length <= passingCouplesCount) {
    return [];
  }

  const lastWinnerScore = scores[passingCouplesCount - 1].score;
  return scores.filter(score => score.score < lastWinnerScore);
}
function hydrateScores(
  participants: Array<Participant>,
  roundScores: Array<Score>
): Array<HydratedScore> {
  return roundScores
    .map(score => {
      const participant = participants.find(
        participant => participant.id === score.participantId
      );
      if (!participant) {
        return null;
      }

      return { score: score.score, participant };
    })
    .filter(Boolean);
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId }: { tournamentId: string }
): ComponentActionProps {
  return {
    submitRoundScores: (roundScores: Array<Score>) => {
      dispatch({
        type: 'SETTLE_DRAW',
        promise: settleDraw(tournamentId, roundScores)
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawSettler);
