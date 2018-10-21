// @flow

import React, { Component } from 'react';
import { Container, Menu, MenuItem } from 'semantic-ui-react';

// $FlowFixMe
import GroupView from './GroupView';
import ScoreView from './ScoreView';

export type TabName = 'groups' | 'scores';

export type Props = {
  tournamentId: string,
  roundId: string
};

type State = {
  activeTab: TabName
};

class RoundOverview extends Component<Props, State> {
  state = {
    activeTab: 'groups'
  };

  onClickTab = (tab: TabName) => {
    this.setState({ activeTab: tab });
  };

  renderTab = () => {
    return this.state.activeTab === 'groups' ? (
      <GroupView
        tournamentId={this.props.tournamentId}
        roundId={this.props.roundId}
      />
    ) : (
      <ScoreView roundId={this.props.roundId} />
    );
  };

  render() {
    return (
      <Container>
        <Menu tabular>
          <MenuItem
            name="groups"
            content="Groups"
            active={this.state.activeTab === 'groups'}
            onClick={() => this.onClickTab('groups')}
          />
          <MenuItem
            name="score"
            content="Scores"
            active={this.state.activeTab === 'scores'}
            onClick={() => this.onClickTab('scores')}
          />
        </Menu>
        {this.renderTab()}
      </Container>
    );
  }
}

export default RoundOverview;
