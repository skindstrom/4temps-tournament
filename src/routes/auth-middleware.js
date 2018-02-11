// @flow
import type { NextFunction } from 'express';
import type { TournamentRepository } from '../data/tournament';
import type { Tournament } from '../models/tournament';
import { TournamentRepositoryImpl } from '../data/tournament';

export function allow(role: PermissionRole) {
  return authorizationMiddleware(new TournamentRepositoryImpl())(role);
}

export function authorizationMiddleware(repository: TournamentRepository) {
  return (...roles: Array<PermissionRole>) => {
    return new AuthorizationChecker(roles, repository).middleware();
  };
}

class AuthorizationChecker {
  _roles: Array<PermissionRole>;
  _repository: TournamentRepository;

  _res: ServerApiResponse;
  _next: NextFunction;
  _user: ?{ id: string, role: PermissionRole };
  _tournamentId: string;

  constructor(roles: Array<PermissionRole>, repository: TournamentRepository) {
    this._roles = roles;
    this._repository = repository;
  }

  middleware = () => async (
    req: ServerApiRequest,
    res: ServerApiResponse,
    next: NextFunction
  ) => {
    this._res = res;
    this._next = next;
    this._user = req.session.user;
    this._tournamentId = req.params.tournamentId || '';

    try {
      if (await this._isAllowed()) {
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (e) {
      this._handleError(e);
    }
  };

  _isAllowed = async () => {
    const funcs: { [role: PermissionRole]: () => Promise<boolean> } = {
      public: this._isAllowedPublic,
      authenticated: this._isAllowedAuthenticated,
      judge: this._isAllowedJudge,
      admin: this._isAllowedAdmin
    };

    let accumulator: boolean = false;
    for (const role of this._roles) {
      accumulator = accumulator || (await funcs[role]());
    }

    return accumulator;
  };

  _isAllowedPublic = async () => true;
  _isAllowedAuthenticated = async () =>
    this._user != null && this._user.role === 'admin';

  _isAllowedAdmin = async () =>
    this._user != null &&
    this._user.role === 'admin' &&
    this._isAdminOfTournament(await this._getTournament());

  _isAdminOfTournament = async (tournament: Tournament) => {
    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    const userId = this._user == null ? '' : this._user.id;
    return tournament.creatorId == userId;
  };

  _isAllowedJudge = async () =>
    this._user != null &&
    this._user.role === 'judge' &&
    this._isJudgeInTournament(await this._getTournament());

  _getTournament = async (): Promise<Tournament> => {
    const tournament = await this._repository.get(this._tournamentId);
    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament;
  };

  _isJudgeInTournament = (tournament: Tournament): boolean => {
    const judgeId = this._user == null ? '' : this._user.id;
    return tournament.judges.filter(({ id }) => id === judgeId).length === 1;
  };

  _handleError = (error: mixed) => {
    if (error instanceof TournamentNotFoundError) {
      this._res.sendStatus(404);
    } else {
      this._res.sendStatus(500);
    }
  };
}

function TournamentNotFoundError() {}
