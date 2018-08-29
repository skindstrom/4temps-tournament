// @flow

import React, { Component } from 'react';
import {
  Header,
  Divider,
  Button,
  Message,
  Form,
  FormGroup,
  FormInput,
  FormRadio,
  FormField
} from 'semantic-ui-react';

type MultipleDanceScoringRule = 'none' | 'average' | 'best';

type Props = {
  onSubmit: (round: RoundViewModel) => void,

  isLoading: boolean,
  createdSuccessfully: boolean,
  validation: RoundValidationSummary
};

type CriterionViewModel = {
  name: string,
  minValue: ?number,
  maxValue: ?number,
  description: string
};

export type RoundViewModel = {
  name: string,
  danceCount: ?number,
  minPairCountPerGroup: ?number,
  maxPairCountPerGroup: ?number,
  passingCouplesCount: ?number,
  multipleDanceScoringRule: MultipleDanceScoringRule,
  criteria: Array<CriterionViewModel>
};
type State = RoundViewModel;

class EditTournamentRounds extends Component<Props, State> {
  state = {
    name: '',
    danceCount: null,
    minPairCountPerGroup: null,
    maxPairCountPerGroup: null,
    passingCouplesCount: null,
    multipleDanceScoringRule: 'average',
    criteria: [
      {
        name: '',
        description: '',
        minValue: null,
        maxValue: null,
        type: 'none'
      }
    ]
  };

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  _onChangeDanceCount = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ danceCount: this._parseCount(event) });
  };

  _onChangeMinPairCountPerGroup = (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    this.setState({ minPairCountPerGroup: this._parseCount(event) });
  };

  _onChangeMaxPairCountPerGroup = (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    this.setState({ maxPairCountPerGroup: this._parseCount(event) });
  };

  _onChangePassingCouplesCount = (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => this.setState({ passingCouplesCount: this._parseCount(event) });

  _parseCount = (event: SyntheticInputEvent<HTMLInputElement>): ?number => {
    const count = parseInt(event.target.value);
    return isNaN(count) ? null : count;
  };

  _onChangeMultipleDanceScoringRule = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: MultipleDanceScoringRule }
  ) => this.setState({ multipleDanceScoringRule: value });

  _countOrEmptyString = (count: ?number): string | number => {
    return count != null ? count : '';
  };

  _renderDanceRule = () => {
    const { danceCount, multipleDanceScoringRule } = this.state;
    const { validation } = this.props;
    if (danceCount != null && danceCount > 1) {
      return (
        <span>
          <span className="field">
            <label htmlFor="dance-rule">
              How are the score of multiple dances handled?
            </label>
          </span>
          <FormGroup id="dance-rule" widths="equal">
            <FormRadio
              label="Average of all dances"
              value="average"
              onChange={this._onChangeMultipleDanceScoringRule}
              checked={multipleDanceScoringRule === 'average'}
            />
            <FormRadio
              label="Only the best dance"
              value="best"
              onChange={this._onChangeMultipleDanceScoringRule}
              checked={multipleDanceScoringRule === 'best'}
            />
          </FormGroup>
          {!validation.isValidMultipleDanceScoringRule && (
            <Message error content="Must pick at least one rule" />
          )}
        </span>
      );
    }
  };

  _renderCriteria = () => this.state.criteria.map(this._renderCriterion);

  _renderCriterion = (criterion: CriterionViewModel, index: number) => {
    const onChangeString = (key: string) => event =>
      this._onChangeCriterion(
        {
          ...criterion,
          [key]: event.target.value
        },
        index
      );
    const onChangeInt = (key: string) => event => {
      this._onChangeCriterion(
        {
          ...criterion,
          [key]: this._parseCount(event)
        },
        index
      );
    };

    const { validation } = this.props;

    const criterionValidation =
      index < validation.criteriaValidation.length
        ? validation.criteriaValidation[index]
        : {
          isValidCriterion: true,
          isValidName: true,
          isValidMinValue: true,
          isValidMaxValue: true,
          isValidValueCombination: true,
          isValidDescription: true
        };

    return (
      <div key={index}>
        <FormGroup widths="equal">
          <FormInput
            label="Name"
            placeholder="Style"
            value={criterion.name}
            onChange={onChangeString('name')}
            error={!criterionValidation.isValidName}
          />
          <FormInput
            label="Description"
            placeholder="How well they incorporate their own style..."
            value={criterion.description}
            onChange={onChangeString('description')}
            error={!criterionValidation.isValidDescription}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <FormInput
            label="Minimum value"
            placeholder="0"
            type="number"
            value={this._countOrEmptyString(criterion.minValue)}
            onChange={onChangeInt('minValue')}
            error={
              !criterionValidation.isValidMinValue ||
              !criterionValidation.isValidValueCombination
            }
          />
          <FormInput
            label="Maximum value"
            placeholder="2"
            type="number"
            value={this._countOrEmptyString(criterion.maxValue)}
            onChange={onChangeInt('maxValue')}
            error={
              !criterionValidation.isValidMaxValue ||
              !criterionValidation.isValidValueCombination
            }
          />
        </FormGroup>
        <Divider />
      </div>
    );
  };

  _onChangeCriterion = (criterion: CriterionViewModel, index: number) => {
    const criteria = [...this.state.criteria];
    criteria[index] = criterion;
    this.setState({ criteria });
  };

  _addCriterion = () =>
    this.setState({
      criteria: [
        ...this.state.criteria,
        {
          name: '',
          description: '',
          minValue: null,
          maxValue: null
        }
      ]
    });

  _onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { validation } = this.props;
    return (
      <Form error={!validation.isValidRound} loading={this.props.isLoading}>
        {this.props.createdSuccessfully && (
          <Message positive content="Success!" />
        )}
        <FormGroup widths="equal">
          <FormInput
            label="Name"
            placeholder="First round"
            value={this.state.name}
            onChange={this._onChangeName}
            error={!validation.isValidName}
          />
          <FormField error={!validation.isValidPassingCouplesCount}>
            <label htmlFor="couple-pass-count">
              Amount of <i>couples</i> that will proceed to the next round
            </label>
            <input
              id="couple-pass-count"
              placeholder="25"
              value={this._countOrEmptyString(this.state.passingCouplesCount)}
              onChange={this._onChangePassingCouplesCount}
            />
          </FormField>
        </FormGroup>
        <FormGroup widths="equal">
          <FormInput
            label="Amount of dances"
            placeholder="1"
            type="number"
            value={this._countOrEmptyString(this.state.danceCount)}
            onChange={this._onChangeDanceCount}
            error={!validation.isValidDanceCount}
          />
          <FormInput
            label="Minimum amount of couples per group"
            placeholder="3"
            type="number"
            value={this._countOrEmptyString(this.state.minPairCountPerGroup)}
            onChange={this._onChangeMinPairCountPerGroup}
            error={
              !validation.isValidMinPairCount ||
              !validation.isMaxPairGreaterOrEqualToMinPair
            }
          />
          <FormInput
            label="Maximum amount of couples per group"
            placeholder="5"
            type="number"
            value={this._countOrEmptyString(this.state.maxPairCountPerGroup)}
            onChange={this._onChangeMaxPairCountPerGroup}
            error={
              !validation.isValidMaxPairCount ||
              !validation.isMaxPairGreaterOrEqualToMinPair
            }
          />
        </FormGroup>
        {this._renderDanceRule()}
        <Divider />
        <Header as="h2">
          Criteria
          <Button
            attached
            floated="right"
            content="Add another criterion"
            onClick={this._addCriterion}
          />
        </Header>
        {this._renderCriteria()}
        <Button type="submit" onClick={this._onSubmit}>
          Submit
        </Button>
      </Form>
    );
  }
}

export default EditTournamentRounds;
