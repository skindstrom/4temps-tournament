// @flow
import validateEmail from './validate-email';
import type { AdminWithPassword } from '../models/admin';
import type { AdminModel } from '../data/admin';

export type AdminCreateValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isEmailNotUsed: boolean,
  isValidFirstName: boolean,
  isValidLastName: boolean,
  isValidPassword: boolean
};

const validateAdmin = async (
  admin: AdminWithPassword,
  getAdmins: ?() => Promise<Array<AdminModel>>
): Promise<AdminCreateValidationSummary> => {
  const isValidFirstName = admin.firstName.length > 0;
  const isValidLastName = admin.lastName.length > 0;
  const isValidPassword = admin.password.length >= 8;
  const isValidEmail = validateEmail(admin.email);

  let isEmailNotUsed = true;
  if (getAdmins != null) {
    isEmailNotUsed =
      (await getAdmins()).findIndex(u => u.email === admin.email) === -1;
  }

  return {
    isValid:
      isValidFirstName &&
      isValidLastName &&
      isValidEmail &&
      isValidPassword &&
      isEmailNotUsed,
    isValidFirstName,
    isValidLastName,
    isValidEmail,
    isValidPassword,
    isEmailNotUsed
  };
};

export default validateAdmin;
