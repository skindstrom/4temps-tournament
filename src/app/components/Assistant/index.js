// @flow
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  GridRow,
  GridColumn,
  Header,
  Container,
  Menu,
  MenuItem
} from 'semantic-ui-react';
import Participants from '../EditTournament/Participants';
import PreloadContainer from '../PreloadContainer';
import { getSingleTournament } from '../../action-creators';

import './styles.css';

type Tabs = 'groups' | 'participants';

type Props = { tournamentId: string };
type State = { activeTab: Tabs };

class AssistantView extends Component<Props, State> {
  state = {
    activeTab: 'groups'
  };

  render() {
    return (
      <Container>
        <TabMenu
          activeTab={this.state.activeTab}
          onClickTab={tab => this.setState({ activeTab: tab })}
        />
        <TabContentContainer
          activeTab={this.state.activeTab}
          tournamentId={this.props.tournamentId}
        />
      </Container>
    );
  }
}

function TabMenu({
  activeTab,
  onClickTab
}: {
  activeTab: Tabs,
  onClickTab: (tab: Tabs) => void
}) {
  return (
    <Menu tabular>
      <MenuItem
        active={activeTab === 'groups'}
        onClick={() => onClickTab('groups')}
      >
        Groups
      </MenuItem>
      <MenuItem
        active={activeTab === 'participants'}
        onClick={() => onClickTab('participants')}
      >
        Participants
      </MenuItem>
    </Menu>
  );
}

function TabContent({
  activeTab,
  tournamentId
}: {
  activeTab: Tabs,
  tournamentId: string
}) {
  if (activeTab === 'groups') {
    return <GroupsContainer tournamentId={tournamentId} />;
  } else if (activeTab === 'participants') {
    return <Participants tournamentId={tournamentId} />;
  } else {
    return 'Invalid tab';
  }
}

// $FlowFixMe
const TabContentContainer = connect(
  ({ tournaments }, props) => ({
    Child: TabContent,
    shouldLoad: tournaments.byId[props.tournamentId] === undefined,
    ...props
  }),
  (dispatch, { tournamentId }) => ({
    load: () => getSingleTournament(dispatch, tournamentId)
  })
)(PreloadContainer);

type GroupsProps = {
  hasActiveRound: boolean,
  roundName: string,
  groups: Array<{ number: number, pairs: Array<string> }>
};
function Groups({ hasActiveRound, roundName, groups }: GroupsProps) {
  if (!hasActiveRound) {
    return <Header>Active round to generate groups</Header>;
  }

  return (
    <Fragment>
      <Header as="h1" textAlign="center">
        {roundName}
      </Header>
      {groups.map(group => (
        <div styleName="group" key={group.number}>
          <Header as="h2">Group {group.number}</Header>
          <Grid>
            <GridRow columns={group.pairs.length}>
              {group.pairs.map(
                (couple, i) =>
                  i % 2 === 0 ? (
                    <GridColumn styleName="column" key={`upper-${couple}`} />
                  ) : (
                    <GridColumn styleName="column" key={`upper-${couple}`}>
                      {couple}
                    </GridColumn>
                  )
              )}
            </GridRow>
            <GridRow columns={group.pairs.length}>
              {group.pairs.map(
                (couple, i) =>
                  i % 2 !== 0 ? (
                    <GridColumn styleName="column" key={`lower-${couple}`} />
                  ) : (
                    <GridColumn styleName="column" key={`lower-${couple}`}>
                      {couple}
                    </GridColumn>
                  )
              )}
            </GridRow>
          </Grid>
        </div>
      ))}
    </Fragment>
  );
}

const GroupsContainer = connect(
  (
    { tournaments, rounds, participants }: ReduxState,
    { tournamentId }: { tournamentId: string }
  ): GroupsProps => {
    const tournament = tournaments.byId[tournamentId];
    const round = tournament.rounds
      .map(id => rounds.byId[id])
      .filter(round => round.active)[0];

    if (!round) {
      return {
        hasActiveRound: false,
        roundName: '',
        groups: []
      };
    }

    const roundName = `Round ${tournament.rounds.findIndex(
      id => id === round.id
    ) + 1}`;
    const groups = round.groups.map((group, i) => ({
      number: i + 1,
      pairs: group.pairs.map(({ leader, follower }) => {
        if (leader == null || follower == null) {
          return '?';
        }

        if (tournament.type === 'classic') {
          return String(participants.byId[leader].attendanceId);
        }

        return `L${participants.byId[leader].attendanceId} - F${
          participants.byId[follower].attendanceId
        }`;
      })
    }));

    return { hasActiveRound: true, roundName, groups };
  }
)(Groups);

function mapStateToProps({ user }: ReduxState): Props {
  return {
    tournamentId: user.tournamentId
  };
}

export default connect(mapStateToProps)(AssistantView);
