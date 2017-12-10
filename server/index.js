// @flow

import express from 'express';
import type { $Request, $Response } from 'express';

const app = express();

app.get('/', (req: $Request, res: $Response) => res.send('Hello world!'));
app.listen(3000, () => console.log('Started express server'));