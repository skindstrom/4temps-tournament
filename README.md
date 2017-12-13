# Installation
## Installing NodeJS and npm
Start by installing NodeJS and npm.
[There's a straight forward tutorial on how to do that on the NodeJS website.](https://docs.npmjs.com/getting-started/installing-node)

_The project is currently only tested with node version 9.2.1 and npm version 5.6.0, but any node version >= 9 and npm version >= 5 should be fine._

## Downloading the repository
Clone the repository by running
```sh
git clone https://github.com/SimonKinds/4temps-tournament.git
```

The directory **4temps-tournament** will henceforth be called the _root directory_.

## Installing the project dependencies
Go to the root directory of the project.
Once there, run `npm install` to install all the dependencies of the project.
**This may take a while**.

**You're now all set to run the website!**

# Usage
From the root directory of the project run `npm start` and wait a short while.

You should now be able to visit `http://localhost:3000` and see the website.
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
## Writing tests
[jest](https://facebook.github.io/jest/) is used for testing.
To run the tests, simply execute `npm test`.
Tests should be placed in a `__tests__` folder, in whatever directory the file you're testing is in.

How to write tests can be found on [jest's website](https://facebook.github.io/jest/docs/en/using-matchers.html#content), but here's a short example taken from their documentation.

```js
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```