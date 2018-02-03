//@flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import ObjectId from 'bson-objectid';
import CreateTournament from './component';
import type { State as ComponentState } from './component';
import { createTournament } from '../../api/tournament';

type Props = {
  history: RouterHistory
}

function mapStateToProps({ ui }: ReduxState) {
  return ui.createTournament;
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    onSubmit: ({ name, date, type }: ComponentState) => dispatch(
      {
        type: 'CREATE_TOURNAMENT',
        promise: createTournament({
          id: ObjectId.generate(),
          creatorId: '',
          name, date, type, judges: [], participants: [], rounds: []
        }),
        meta: {
          onSuccess: ({ id }: { id: string }) =>
            history.push(`/tournament/edit/${id}`)
        }
      }
    )
  };
}

const CreateTournamentContainer =
  connect(mapStateToProps, mapDispatchToProps)(CreateTournament);

export default CreateTournamentContainer;
