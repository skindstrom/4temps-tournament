[![Build Status](https://travis-ci.org/SimonKinds/4temps-tournament.svg?branch=master)](https://travis-ci.org/SimonKinds/4temps-tournament)

# Installation
## Installing NodeJS and npm
Start by installing NodeJS and npm.
[There's a straight forward tutorial on how to do that on the NodeJS website.](https://docs.npmjs.com/getting-started/installing-node)

**Requires Node v10 or later**

## Installing MongoDB
We use `MongoDB` to store data.
Download it from [their website](https://docs.mongodb.com/manual/administration/install-community/).
Once you've installed it, **make sure that it's running before you try to run the website**. If it's not running, an error message will be printed.

## Downloading the repository
Clone the repository by running
```sh
git clone https://github.com/SimonKinds/4temps-tournament.git
```

The directory **4temps-tournament** will henceforth be called the _root directory_.

## Setting up the environment
Some parts of the application is configured via environment variables.
These can be set in a `.env` file in the root directory.
An example `.env` file can be seen below.
**Setting these are required. The example below will give you a fully functioning example.**
```sh
NODE_ENV=development
DB_URI=mongodb://localhost/4temps
COOKIE_SECRET="super secret cookie secret"
HOSTNAME=localhost
PORT=3000
```

## Installing the project dependencies
Go to the root directory of the project.
Once there, run `npm install` to install all the dependencies of the project.
**This may take a while**.

**You're now all set to run the website!**


# Usage
From the root directory of the project run `npm start` and wait for quite some time.
The reason it takes a while is that `babel` compiles the server code, and `webpack` bundles all the frontend code into a single file.
Once the bundle is created, the server will restart.
<sub>_And here I thought javascript wasn't a compiled language..._</sub>

You should now be able to visit `http://localhost:3000`.
Any changes to the source files will automatically recompile the project and restart the server.

## Run the optimized version
Running `npm start` will create a non-optimized version, used for development.
To create a optimized version, run the following commands.

**Make sure that `npm start` is not running.**
```sh
npm run build
npm run start:prod
```

Once again, you should be able to visit `http://localhost:3000`.

# Contributing
## Handling user input
User input has to **always** be validated before handled on the server.
To enable a more responsive user experience, it's recommended to also validate on the client, before forwarding the request to the server.

The validators should be shared between the front-end and back-end, and be placed in `src/validators`.
It's recommended to create a type representing a summary of the errors, to enable better error messages for the user (and the developer).

An example can be found in `src/validators/validate-user.js`
```js
type UserCreateValidationSummary = {
  isValid: boolean,
  isValidEmail: boolean,
  isEmailNotUsed: boolean,
  isValidFirstName: boolean,
  isValidLastName: boolean,
  isValidPassword: boolean,
};
```

In the above example there is one field that can not be checked by the client, `isEmailNotUsed`.
Therefore, `validate-user` will set `isEmailNotUsed` to `true` if access to the database is not given.

## Accessing the database
Anything that accesses the database should be abstracted away from the code that uses the result.
Any database access should be placed in a file with the same name as the **table** it accesses in the `src/data` directory.

For example, access to `user` table (or **collection** using MongoDB vocabulary) is placed in `src/data/user.js` and exports a `UserModel` that represents the database user type.
What follows is a short example of how access to a user might be implemented.
```js
// @flow
import mongoose from 'mongoose';

export type UserModel = {
  _id: ObjectId,
  email: string,
  password: string
}

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});
const Model = mongoose.model('user', schema);

export const getUserFromId = async (userId: ObjectId): Promise<?UserModel> => {
  try {
    return await Model.findOne({ _id: userId });
  } catch (e) {
    return null;
  }
};
```

## Writing tests
[jest](https://facebook.github.io/jest/) is used for testing.
To run the tests, simply execute `npm test`.
Tests should be placed in a `__tests__` folder, in whatever directory the file you're testing is in, e.g. the test for `src/validators/validate-user.js` should be placed in `src/validators/__tests__/validate-user.js`

How to write tests can be found on [jest's website](https://facebook.github.io/jest/docs/en/using-matchers.html#content), but here's a short example taken from their documentation.

```js
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```

and an example from our codebase using `async` and `await`.

```js
test('Valid info is valid', async () => {
  const user: UserCredentials = {
    email: 'test@test.com',
    password: 'password'
  };

  const result = await validateUserLogin(user);

  expect(result.isValid).toBe(true);
  expect(result.isValidEmail).toBe(true);
  expect(result.isValidPassword).toBe(true);
  expect(result.doesUserExist).toBe(true);
});
```
