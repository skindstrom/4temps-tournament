// @flow

import express from 'express';
import type { $Request, $Response } from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: $Request, res: $Response) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
});
app.listen(3000, () => console.log('Started express server'));