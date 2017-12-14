// @flow
import type { UserWithPassword } from "./user";

export type UserCreateValidationSummary = {
    isValid: boolean,
    isValidEmail: boolean,
    isValidFirstName: boolean,
    isValidLastName: boolean,
    isValidPassword: boolean
};

const validateEmail = (email: string): boolean =>{
  // http://emailregex.com/
  return -1 !== email.search(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}


const validateUser = (user: UserWithPassword): UserCreateValidationSummary => {
  const isValidFirstName = user.firstName.length > 0;
  const isValidLastName = user.lastName.length > 0;
  const isValidPassword = user.password.length >= 8;
  const isValidEmail = validateEmail(user.email);
  return {
    isValid: isValidFirstName && isValidLastName
            && isValidEmail && isValidPassword,
    isValidFirstName,
    isValidLastName,
    isValidEmail,
    isValidPassword,
  };
};

export default validateUser;