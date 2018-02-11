// @flow
import type Moment from 'moment';
import type { Participant } from './participant';

export type TournamentType = 'none' | 'jj' | 'classic';

export type Tournament = {
  id: string,
  creatorId: string,
  name: string,
  date: Moment,
  type: TournamentType,
  judges: Array<Judge>,
  participants: Array<Participant>,
  rounds: Array<Round>
};
