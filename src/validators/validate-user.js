// @flow
import validateEmail from './validate-email';
import type { User, UserWithPassword } from "../models/user";

export type UserCreateValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isEmailNotUsed: boolean,
  isValidFirstName: boolean,
  isValidLastName: boolean,
  isValidPassword: boolean,
};


const validateUser = async (
  user: UserWithPassword,
  getUsers: ?() =>
    Promise<Array<User>>): Promise<UserCreateValidationSummary> => {
  const isValidFirstName = user.firstName.length > 0;
  const isValidLastName = user.lastName.length > 0;
  const isValidPassword = user.password.length >= 8;
  const isValidEmail = validateEmail(user.email);

  let isEmailNotUsed = true;
  if (getUsers != null) {
    isEmailNotUsed =
      (await getUsers()).findIndex(u => u.email === user.email) === -1;
  }

  return {
    isValid: isValidFirstName && isValidLastName
      && isValidEmail && isValidPassword && isEmailNotUsed,
    isValidFirstName,
    isValidLastName,
    isValidEmail,
    isValidPassword,
    isEmailNotUsed,
  };
};

export default validateUser;