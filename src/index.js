// @flow

import './config';
import Server from './server';
import { disconnect as disconnectDb } from './data/setup';

const server = Server.initialize();
server.listen();

process.on('SIGTERM', stopApplication);
process.on('SIGINT', stopApplication);

function stopApplication() {
  /* eslint-disable no-console */
  console.log('Stopping...');

  server.stop(() => {
    console.log('Stopped server');
    disconnectDb();
    console.log('Disconnected db');
    console.log('Stopped. Bye Bye!');
  });
  /* eslint-enable no-console */
}