// @flow
import { apiPostRequest } from '../util';

import validateAdmin from '../../../validators/validate-admin';
import validateAdminLogin from '../../../validators/validate-admin-login';

import type {
  AdminCredentials,
  AdminWithPassword
} from '../../../models/admin';
import type { AdminLoginValidationSummary } from '../../../validators/validate-admin-login';
import type { AdminCreateValidationSummary } from '../../../validators/validate-admin';

export const createAdmin = async (
  admin: AdminWithPassword
): Promise<AdminCreateValidationSummary> => {
  let result = await validateAdmin(admin);
  if (!result.isValid) {
    throw result;
  }
  return apiPostRequest('/api/admin/create', admin);
};

export const loginAdmin = async (
  credentials: AdminCredentials
): Promise<AdminLoginValidationSummary> => {
  let result = await validateAdminLogin(credentials);
  if (!result.isValid) {
    throw result;
  }

  return apiPostRequest('/api/admin/login', credentials);
};

export const logoutAdmin = async (): Promise<boolean> => {
  return apiPostRequest('/api/admin/logout');
};
