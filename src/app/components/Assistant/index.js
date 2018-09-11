// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Menu, MenuItem } from 'semantic-ui-react';
import Participants from '../EditTournament/Participants';

type Tabs = 'rounds' | 'participants';

type Props = { tournamentId: string };
type State = { activeTab: Tabs };

class AssistantView extends Component<Props, State> {
  state = {
    activeTab: 'rounds'
  };

  render() {
    return (
      <Container>
        <TabMenu
          activeTab={this.state.activeTab}
          onClickTab={tab => this.setState({ activeTab: tab })}
        />
        <TabContent
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
        active={activeTab === 'rounds'}
        onClick={() => onClickTab('rounds')}
      >
        Rounds
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
  if (activeTab === 'rounds') {
    return 'rounds';
  } else if (activeTab === 'participants') {
    return <Participants tournamentId={tournamentId} />;
  } else {
    return 'Invalid tab';
  }
}

function mapStateToProps({ user }: ReduxState): Props {
  return {
    tournamentId: user.tournamentId
  };
}

export default connect(mapStateToProps)(AssistantView);
