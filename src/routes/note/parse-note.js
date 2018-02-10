// @flow

export function parseNote(body: mixed): JudgeNote {
  if (
    typeof body === 'object'
    && body != null
    && typeof body.judgeId === 'string'
    && body.judgeId != null
    && typeof body.danceId === 'string'
    && body.danceId != null
    && typeof body.criterionId === 'string'
    && body.criterionId != null
    && typeof body.participantId === 'string'
    && body.participantId != null
    && typeof body.value === 'number'
    && Number.isInteger(body.value)
    && body.value != null
  ) {
    const note: JudgeNote = {
      judgeId: body.judgeId,
      danceId: body.danceId,
      criterionId: body.criterionId,
      participantId: body.participantId,
      value: body.value
    };
    return note;
  }
  throw new InvalidBodyError();
}

export function parseNotes(body: mixed): Array<JudgeNote> {
  if (Array.isArray(body)) {
    return body.map(parseNote);
  }
  throw new InvalidBodyError();
}


export function InvalidBodyError(){}