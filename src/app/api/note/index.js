// @flow
import { apiPostRequest, apiGetRequest } from '../util';

export async function setTemporaryNote(
  tournamentId: string,
  note: JudgeNote
): Promise<JudgeNote> {
  return apiPostRequest(`/api/note/${tournamentId}/temporary/set`, note);
}

export async function getTemporaryNotesForDance(
  tournamentId: string,
  danceId: string
): Promise<Array<JudgeNote>> {
  return apiGetRequest(`/api/note/${tournamentId}/temporary/dance/${danceId}`);
}

export async function submitNotes(
  tournamentId: string,
  notes: Array<JudgeNote>
): Promise<JudgeNote> {
  return apiPostRequest(`/api/note/${tournamentId}/final/submit`, notes);
}
