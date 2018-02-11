// @flow
import validateEmail from './validate-email';
import type { AdminModel } from '../data/admin';

export type AdminLoginValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isValidPassword: boolean,
  doesAdminExist: boolean
};

const validateAdminLogin = async (
  admin: AdminCredentials,
  getAdmin: ?(AdminCredentials) => Promise<?AdminModel>
): Promise<AdminLoginValidationSummary> => {
  const isValidEmail = validateEmail(admin.email);
  const isValidPassword = admin.password.length > 0;

  let doesAdminExist = true;
  if (getAdmin != null) {
    doesAdminExist = (await getAdmin(admin)) != null;
  }

  return {
    isValid: isValidEmail && isValidPassword && doesAdminExist,
    isValidEmail,
    isValidPassword,
    doesAdminExist
  };
};

export default validateAdminLogin;
