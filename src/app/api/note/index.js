// @flow
import { apiPostRequest } from '../util';

export async function setTemporaryNote(
  tournamentId: string,
  note: JudgeNote
): Promise<JudgeNote> {
  return apiPostRequest(`/api/note/${tournamentId}/set`, note);
}

export async function submitNotes(
  tournamentId: string,
  notes: Array<JudgeNote>
): Promise<JudgeNote> {
  return apiPostRequest(`/api/note/${tournamentId}/submit`, notes);
}
