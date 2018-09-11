// @flow
import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';

type Tabs = 'rounds' | 'participants';

type Props = {};
type State = { activeTab: Tabs };

export default class AssistantView extends Component<Props, State> {
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
        <TabContent activeTab={this.state.activeTab} />
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

function TabContent({ activeTab }: { activeTab: Tabs }) {
  if (activeTab === 'rounds') {
    return 'rounds';
  } else if (activeTab === 'participants') {
    return 'participants';
  } else {
    return 'Invalid tab';
  }
}
