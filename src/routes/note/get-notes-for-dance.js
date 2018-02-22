// @flow
import type { NoteRepository } from '../../data/note';

export default function getNotesRouteForDanceRoute(repository: NoteRepository) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    const notes = await repository.getForDance(req.params.danceId);
    res.json(notes);
  };
}
