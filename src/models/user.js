// @flow

export type User = {
  firstName: string,
  lastName: string,
  email: string
}

export type UserWithPassword = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export type UserCredentials = {
  email: string,
  password: string
}
