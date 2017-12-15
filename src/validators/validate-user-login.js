// @flow
import validateEmail from './validate-email';
import type { UserCredentials } from '../models/user';

export type UserLoginValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean
};

const validateUserLogin =
  (user: UserCredentials): UserLoginValidationSummary => {
    const isValidEmail = validateEmail(user.email);
    const isValidPassword = user.password.length > 0;

    return {
      isValid: isValidEmail && isValidPassword,
      isValidEmail,
      isValidPassword
    };
  };

export default validateUserLogin;