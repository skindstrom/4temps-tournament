// @flow
import type { NextFunction, } from 'express';
import type {TournamentRepository} from '../data/tournament';
import type {Tournament} from '../models/tournament';
import {TournamentRepositoryImpl} from '../data/tournament';

type PermissionRole = 'public' | 'admin' | 'authenticated';

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
      this._userId = req.session.user != null ? req.session.user._id : '';
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

      if (req.session.user != null) {
        next();
      } else {
        res.sendStatus(401);
      }
    }
}

function TournamentNotFoundError(){}
