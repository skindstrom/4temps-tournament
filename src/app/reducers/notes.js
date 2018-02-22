// @flow
import { handle } from 'redux-pack';

export default function notesReducer(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction
): NotesReduxState {
  switch (action.type) {
  case 'GET_NOTES':
    return getNotes(state, action);
  case 'SET_NOTE':
    return setNote(state, action);
  }
  return state;
}

export function getInitialState(): NotesReduxState {
  return { isLoading: false, didLoad: false };
}

function getNotes(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction
): NotesReduxState {
  const { payload }: { payload: Array<JudgeNote> } = action;
  return handle(state, action, {
    start: prevState => ({
      ...prevState,
      isLoading: true
    }),
    success: prevState => ({
      ...prevState,
      isLoading: false,
      didLoad: true,
      ...payload.reduce((acc, note) => {
        return {
          ...acc,
          [note.participantId]: {
            ...acc[note.participantId],
            [note.criterionId]: note
          }
        };
      }, {})
    }),
    failure: prevState => ({
      ...prevState,
      isLoading: false,
      didLoad: false
    })
  });
}

function setNote(
  state: NotesReduxState = getInitialState(),
  action: ReduxPackAction
): NotesReduxState {
  const { payload }: { payload: JudgeNote } = action;
  return handle(state, action, {
    success: prevState => ({
      ...prevState,
      [payload.participantId]: {
        ...prevState[payload.participantId],
        [payload.criterionId]: payload
      }
    })
  });
}
