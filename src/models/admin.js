// @flow

export type Admin = {
  firstName: string,
  lastName: string,
  email: string
}

export type AdminWithPassword = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export type AdminCredentials = {
  email: string,
  password: string
}
