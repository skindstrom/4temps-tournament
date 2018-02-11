// @flow

export type ParticipantValidationSummary = {
  isValidParticipant: boolean,
  isValidName: boolean,
  isValidRole: boolean
};

export const validateParticipant = (
  participant: Participant
): ParticipantValidationSummary => {
  const { name, role } = participant;

  const isValidName = name.length > 0;
  const isValidRole =
    role === 'leader' || role === 'follower' || role === 'leaderAndFollower';

  return {
    isValidParticipant: isValidName && isValidRole,
    isValidName,
    isValidRole
  };
};

export default validateParticipant;
