// @flow

import moment from 'moment';

import validateTournament from '../../../validators/validate-tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';
import type { Tournament } from '../../../models/tournament';

type Request<T> = {
  wasAuthenticated: boolean,
  result: ?T
}

export type ApiRequest<T> = Promise<Request<T>>

export const createTournament =
  async (tournament: Tournament): ApiRequest<TournamentValidationSummary> => {
    let result = validateTournament(tournament);
    if (!result.isValidTournament) {
      return {
        wasAuthenticated: true,
        result
      };
    }

    const httpResult = await fetch('/api/tournament/create',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(tournament),
        credentials: 'include'
      });

    if (httpResult.status === 301) {
      return { wasAuthenticated: false, result: null };
    }

    return { wasAuthenticated: true, result: await httpResult.json() };
  };

export const getTournamentsForUser =
  async (): ApiRequest<Array<Tournament>> => {
    const httpResult = await fetch('/api/tournament/get',
      {
        headers: {
          'Accept': 'application/json',
        },
        method: 'GET',
        credentials: 'include'
      });

    if (httpResult.status === 301) {
      return { wasAuthenticated: false, result: null };
    }

    const result =
      (await httpResult.json())
        .map(({ date, ...rest }) => ({ date: moment(date), ...rest }));

    return { wasAuthenticated: true, result };
  };