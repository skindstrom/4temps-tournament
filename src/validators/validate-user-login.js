// @flow
import validateEmail from './validate-email';
import type { UserCredentials } from '../models/user';
import type { UserModel } from '../data/user';

export type UserLoginValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesUserExist: boolean,
};

const validateUserLogin = async (
  user: UserCredentials,
  getUser: ?(UserCredentials) => Promise<?UserModel>
): Promise<UserLoginValidationSummary> => {
  const isValidEmail = validateEmail(user.email);
  const isValidPassword = user.password.length > 0;

  let doesUserExist = true;
  if (getUser != null) {
    doesUserExist = (await getUser(user)) != null;
  }

  return {
    isValid: isValidEmail && isValidPassword && doesUserExist,
    isValidEmail,
    isValidPassword,
    doesUserExist
  };
};

export default validateUserLogin;