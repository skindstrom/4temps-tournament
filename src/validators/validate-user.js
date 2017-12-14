// @flow
import type { User, UserWithPassword } from "../models/user";

export type UserCreateValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isEmailNotUsed: boolean,
  isValidFirstName: boolean,
  isValidLastName: boolean,
  isValidPassword: boolean,
};

const validateEmail = (email: string): boolean => {
  // http://emailregex.com/
  // eslint-disable-next-line max-len
  return -1 !== email.search(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}


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