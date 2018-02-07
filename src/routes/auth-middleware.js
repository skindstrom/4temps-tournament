// @flow
import type { NextFunction, } from 'express';
import type {TournamentRepository} from '../data/tournament';
import type {Tournament} from '../models/tournament';
import {TournamentRepositoryImpl} from '../data/tournament';

export function allow(role: PermissionRole) {
  return authorizationMiddleware(new TournamentRepositoryImpl())(role);
}

export function authorizationMiddleware(repository: TournamentRepository) {
  return (role: PermissionRole) => {
    let handler: AuthorizationCheckHandler;
    switch(role) {
    case 'public':
      handler = new AuthorizationCheckPublicHandler();
      break;
    case 'authenticated':
      handler =  new AuthorizationCheckAuthenticatedHandler();
      break;
    case 'admin':
      handler =  new AuthorizationCheckAdminHandler(repository);
      break;
    case 'judge':
      handler = new AuthorizationCheckJudgeHandler(repository);
      break;
    default:
      throw new Error('invalid role');
    }

    return handler.middleware();
  };
}

interface AuthorizationCheckHandler {
  middleware(): (
    req: ServerApiRequest,
    res: ServerApiResponse,
    next: NextFunction) => Promise<void>
}

class AuthorizationCheckAdminHandler implements AuthorizationCheckHandler {
  _repository: TournamentRepository;

  _res: ServerApiResponse;
  _next: NextFunction;
  _userId: string;
  _tournamentId: string;
  _tournament: Tournament;

  constructor(repository: TournamentRepository) {
    this._repository = repository;
  }

  middleware = () =>
    async (
      req: ServerApiRequest, res: ServerApiResponse, next: NextFunction) => {

      this._res = res;
      this._next = next;
      this._userId = req.session.user != null ? req.session.user.id : '';
      this._tournamentId = req.params.tournamentId || '';

      try {
        if (await this._isAdmin()) {
          next();
        } else {
          res.sendStatus(401);
        }
      } catch (e) {
        this._handleError(e);
      }
    }

  _isAdmin = async () => {
    const tournament = await this._repository.get(this._tournamentId);

    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament.creatorId == this._userId;
  }

  _handleError = (error: mixed) => {
    if (error instanceof TournamentNotFoundError) {
      this._res.sendStatus(404);
    } else {
      this._res.sendStatus(500);
    }
  }
}

class AuthorizationCheckPublicHandler implements AuthorizationCheckHandler {
  middleware = () =>
    async (
      req: ServerApiRequest, res: ServerApiResponse, next: NextFunction) => {

      next();
    }
}

class AuthorizationCheckAuthenticatedHandler
implements AuthorizationCheckHandler {

  middleware = () =>
    async (
      req: ServerApiRequest, res: ServerApiResponse, next: NextFunction) => {

      if (req.session.user != null && req.session.user.role === 'admin') {
        next();
      } else {
        res.sendStatus(401);
      }
    }
}

class AuthorizationCheckJudgeHandler implements AuthorizationCheckHandler {
  _repo: TournamentRepository;

  _judgeId: string;
  _requestTournamentId: string;

  constructor(repo: TournamentRepository) {
    this._repo = repo;
  }

  middleware = () =>
    async (
      req: ServerApiRequest,
      res: ServerApiResponse,
      next: NextFunction) => {

      try {
        this._parseRequest(req);
        const tournament = await this._getTournament();
        if (this._isJudgeInTournament(tournament)) {
          next();
        } else {
          res.sendStatus(401);
        }
      } catch (e) {
        this._statusFromError(e);
      }
    }

  _parseRequest = (req: ServerApiRequest) => {
    if (req.params.tournamentId != '' && req.session.user != null) {
      this._requestTournamentId = req.params.tournamentId;
      this._judgeId = req.session.user.id;
    } else {
      throw new InvalidRequestError();
    }
  }

  _getTournament = async (): Promise<Tournament> => {
    const tournament = await this._repo.get(this._requestTournamentId);
    if (tournament == null) {
      throw new TournamentNotFoundError();
    }

    return tournament;
  }

  _isJudgeInTournament = (tournament: Tournament): boolean => {
    return tournament.judges
      .filter(({ id }) => id === this._judgeId).length === 1;
  }

  _statusFromError = (e: mixed) => {
    if (e instanceof TournamentNotFoundError) {
      return 404;
    } else if (e instanceof InvalidRequestError) {
      return 400;
    }
    return 500;
  }
}

function TournamentNotFoundError() { }
function InvalidRequestError() { }