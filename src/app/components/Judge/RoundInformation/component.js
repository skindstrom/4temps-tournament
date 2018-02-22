// @flow
import React, { PureComponent } from 'react';
import { Header, HeaderSubheader, Container } from 'semantic-ui-react';

type Props = {
  roundName: string,
  groupInformation: { groupNumber: number },
  danceInformation: { danceNumber: number }
};

class RoundInformation extends PureComponent<Props> {
  render() {
    const groupNumber = this.props.groupInformation.groupNumber;
    const danceNumber = this.props.danceInformation.danceNumber;
    return (
      <Container>
        <Header as="h2">
          {this.props.roundName}
          <HeaderSubheader>Group: {groupNumber}</HeaderSubheader>
          <HeaderSubheader>Dance: {danceNumber}</HeaderSubheader>
        </Header>
      </Container>
    );
  }
}

export default RoundInformation;
