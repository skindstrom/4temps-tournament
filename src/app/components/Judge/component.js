// @flow
import { Container } from 'semantic-ui-react';

import React, { Component } from 'react';
import RoundInformation from './RoundInformation';
import RoundNotes from './RoundNotes';

type Props = {
  hasActiveDance: boolean
};
class Judge extends Component<Props> {
  _renderNoActiveDance = () => {
    return <h1>Theres no active dance</h1>;
  };

  _renderActiveDance = () => {
    return (
      <Container>
        <RoundInformation />
        <RoundNotes />
      </Container>
    );
  };

  render() {
    return this.props.hasActiveDance
      ? this._renderActiveDance()
      : this._renderNoActiveDance();
  }
}

export default Judge;
