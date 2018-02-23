// @flow
import type { NoteRepository } from '../../data/note';

export default function getNotesRouteForDanceRoute(repository: NoteRepository) {
  return async (req: ServerApiRequest, res: ServerApiResponse) => {
    const notes = (await repository.getForDance(req.params.danceId)).filter(
      ({ judgeId }) =>
        req.session.user != null && judgeId === req.session.user.id
    );
    res.json(notes);
  };
}
