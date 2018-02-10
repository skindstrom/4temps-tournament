// @flow
import React, { PureComponent } from 'react';
import { Header, HeaderSubheader } from 'semantic-ui-react';

type Props = {
  roundName: string,
  groupInformation: {groupNumber: number, numberOfGroups: number},
  danceInformation: {danceNumber: number, numberOfDances: number}
}

class RoundInformation extends PureComponent<Props> {
  render() {
    const numberOfGroups = this.props.groupInformation.numberOfGroups;
    const groupNumber = this.props.groupInformation.groupNumber;
    const numberOfDances = this.props.danceInformation.numberOfDances;
    const danceNumber = this.props.danceInformation.danceNumber;
    return (
      <Header as='h2'>
        {this.props.roundName}
        <HeaderSubheader>
          Group: {groupNumber} of {numberOfGroups}
        </HeaderSubheader>
        <HeaderSubheader>
          Dance: {danceNumber} of {numberOfDances}
        </HeaderSubheader>
      </Header>
    );
  }
}

export default RoundInformation;