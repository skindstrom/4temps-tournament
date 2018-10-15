// @flow

import React, { Fragment } from 'react';
import {
  Button,
  Header,
  Container,
  Table,
  Icon,
  Checkbox,
  Loader,
  Message
} from 'semantic-ui-react';

import './styles.css';

type ScoreViewModel = { score: number, participant: Participant };

export type Props = {
  roundName: string,
  isPairRound: boolean,
  passingCouplesCount: number,
  leaders: {
    winners: Array<ScoreViewModel>,
    losers: Array<ScoreViewModel>,
    draw: Array<ScoreViewModel>
  },
  followers: {
    winners: Array<ScoreViewModel>,
    losers: Array<ScoreViewModel>,
    draw: Array<ScoreViewModel>
  },
  isLoading: boolean,
  didSubmit: boolean,
  successfulSubmit: boolean,
  errorMessage: string
};

export type ActionProps = {
  submitRoundScores: (roundScores: Array<Score>) => void
};

class DrawSettler extends React.Component<
  Props & ActionProps,
  { checkedLeaders: Array<string>, checkedFollowers: Array<string> }
> {
  state = {
    checkedLeaders: [],
    checkedFollowers: []
  };

  addLeader = (participant: Participant) => {
    this.setState({
      checkedLeaders: [...this.state.checkedLeaders, participant.id]
    });
  };

  removeLeader = (participant: Participant) => {
    this.setState({
      checkedLeaders: this.state.checkedLeaders.filter(
        winner => winner !== participant.id
      )
    });
  };

  addFollower = (participant: Participant) => {
    this.setState({
      checkedFollowers: [...this.state.checkedFollowers, participant.id]
    });
  };

  removeFollower = (participant: Participant) => {
    this.setState({
      checkedFollowers: this.state.checkedFollowers.filter(
        winner => winner !== participant.id
      )
    });
  };

  drawWithCheck = (scores: Array<ScoreViewModel>, checked: Array<string>) => {
    return scores.map(score => ({
      ...score,
      checked: checked.includes(score.participant.id)
    }));
  };

  submitRoundScores = () => {
    const { leaders, followers } = this.props;
    const leaderScores = this.concatScores(
      leaders.winners,
      this.drawWithCheck(leaders.draw, this.state.checkedLeaders),
      leaders.losers
    );
    const followerScores = this.concatScores(
      followers.winners,
      this.drawWithCheck(followers.draw, this.state.checkedFollowers),
      followers.losers
    );

    this.props.submitRoundScores([...leaderScores, ...followerScores]);
  };

  concatScores = (
    winners: Array<ScoreViewModel>,
    draw: Array<ScoreViewModel & { checked: boolean }>,
    losers: Array<ScoreViewModel>
  ): Array<Score> => {
    return winners
      .concat(draw.filter(checked => checked))
      .concat(draw.filter(checked => !checked))
      .concat(losers)
      .map(score => ({
        score: score.score,
        participantId: score.participant.id
      }));
  };

  render() {
    const {
      isPairRound,
      roundName,
      passingCouplesCount,
      leaders,
      followers
    } = this.props;

    const leaderCount =
      leaders.winners.length + this.state.checkedLeaders.length;
    const followerCount =
      leaders.winners.length + this.state.checkedFollowers.length;

    return (
      <Container>
        <Header as="h1">
          There is a draw. Please select the winners.
          <Header.Subheader>{roundName}</Header.Subheader>
        </Header>
        <p>
          <strong>
            The given score includes the notes from all judges, including the
            president
          </strong>
        </p>
        <Button
          primary
          onClick={this.submitRoundScores}
          disabled={
            leaderCount !== passingCouplesCount ||
            (followerCount !== passingCouplesCount && !isPairRound)
          }
        >
          Submit
        </Button>
        <Loader inline active={this.props.isLoading} />
        <Message
          error
          hidden={!this.props.didSubmit || this.props.successfulSubmit}
        >
          <Message.Header>Error</Message.Header>
          {this.props.errorMessage}
        </Message>
        {isPairRound ? (
          <DrawSettlerTable
            header="Couples"
            winners={leaders.winners}
            draw={this.drawWithCheck(leaders.draw, this.state.checkedLeaders)}
            losers={leaders.losers}
            addWinner={this.addLeader}
            removeWinner={this.removeLeader}
            passingCouplesCount={passingCouplesCount}
            currentCouplesCount={leaderCount}
          />
        ) : (
          <Fragment>
            <DrawSettlerTable
              header="Leaders"
              winners={leaders.winners}
              draw={this.drawWithCheck(leaders.draw, this.state.checkedLeaders)}
              losers={leaders.losers}
              addWinner={this.addLeader}
              removeWinner={this.removeLeader}
              passingCouplesCount={passingCouplesCount}
              currentCouplesCount={leaderCount}
            />
            <DrawSettlerTable
              header="Followers"
              winners={followers.winners}
              draw={this.drawWithCheck(
                followers.draw,
                this.state.checkedFollowers
              )}
              losers={followers.losers}
              addWinner={this.addFollower}
              removeWinner={this.removeFollower}
              passingCouplesCount={passingCouplesCount}
              currentCouplesCount={followerCount}
            />
          </Fragment>
        )}
      </Container>
    );
  }
}

function DrawSettlerTable({
  header,
  winners,
  losers,
  draw,
  addWinner,
  removeWinner,
  currentCouplesCount,
  passingCouplesCount
}: {
  header: string,
  winners: Array<ScoreViewModel>,
  losers: Array<ScoreViewModel>,
  draw: Array<ScoreViewModel & { checked: boolean }>,
  addWinner: (participant: Participant) => void,
  removeWinner: (participant: Participant) => void,
  currentCouplesCount: number,
  passingCouplesCount: number
}) {
  return (
    <div styleName="draw-table">
      <Header as="h2">{header}</Header>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>ID</Table.Cell>
            <Table.Cell>Score (includes score by president)</Table.Cell>
            <Table.Cell>
              Pass {`${currentCouplesCount} / ${passingCouplesCount}`}
            </Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {winners.map(score => (
            <Table.Row key={score.participant.id}>
              <Table.Cell>{score.participant.attendanceId}</Table.Cell>
              <Table.Cell>{score.score}</Table.Cell>
              <Table.Cell>
                <Icon name="check" color="green" />
              </Table.Cell>
            </Table.Row>
          ))}
          {draw.map(score => (
            <Table.Row key={score.participant.id}>
              <Table.Cell>{score.participant.attendanceId}</Table.Cell>
              <Table.Cell>{score.score}</Table.Cell>
              <Table.Cell>
                <Checkbox
                  checked={score.checked}
                  disabled={
                    !score.checked &&
                    currentCouplesCount === passingCouplesCount
                  }
                  onClick={() =>
                    score.checked
                      ? removeWinner(score.participant)
                      : addWinner(score.participant)
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
          {losers.map(score => (
            <Table.Row key={score.participant.id}>
              <Table.Cell>{score.participant.attendanceId}</Table.Cell>
              <Table.Cell>{score.score}</Table.Cell>
              <Table.Cell>
                <Icon name="close" color="red" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default DrawSettler;
