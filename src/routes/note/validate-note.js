// @flow

export default function validateNoteForTournamentAndUser(
  note: JudgeNote,
  tournament: Tournament,
  user: ?User
) {
  if (user == null || note.judgeId != user.id) {
    throw new WrongJudgeError();
  }

  if (!isDanceActive(tournament, note.danceId)) {
    throw new DanceNotActiveError();
  }

  const criterion = getCriterion(tournament, note.criterionId);
  const participant = getParticipant(tournament, note.participantId);

  if (!isValidCriterionForParticipant(criterion, participant)) {
    throw new InvalidCriterionForParticipant();
  }

  if (!isValueWithinRange(criterion, note.value)) {
    throw new InvalidValueError();
  }
}

function isDanceActive(tournament: Tournament, danceId: string): boolean {
  for (const round of tournament.rounds) {
    for (const group of round.groups) {
      for (const dance of group.dances) {
        if (dance.id === danceId) {
          return true;
        }
      }
    }
  }
  return false;
}
function getCriterion(
  tournament: Tournament,
  criterionId: string
): RoundCriterion {
  for (const round of tournament.rounds) {
    for (const criterion of round.criteria) {
      if (criterion.id === criterionId) {
        return criterion;
      }
    }
  }
  throw new CriterionNotFoundError();
}
function getParticipant(
  tournament: Tournament,
  participantId: string
): Participant {
  for (const participant of tournament.participants) {
    if (participant.id === participantId) {
      return participant;
    }
  }
  throw new ParticipantNotFoundError();
}

function isValidCriterionForParticipant(
  criterion: RoundCriterion,
  participant: Participant
): boolean {
  if (criterion.type === 'leader') {
    return (
      participant.role === 'leader' || participant.role === 'leaderAndFollower'
    );
  } else if (criterion.type === 'follower') {
    return (
      participant.role === 'follower' ||
      participant.role === 'leaderAndFollower'
    );
  }

  return true;
}

function isValueWithinRange(criterion: RoundCriterion, value: number) {
  return criterion.minValue <= value && value <= criterion.maxValue;
}

export function DanceNotActiveError() {}
export function CriterionNotFoundError() {}
export function ParticipantNotFoundError() {}
export function InvalidCriterionForParticipant() {}
export function InvalidValueError() {}
export function WrongJudgeError() {}
