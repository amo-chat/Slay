// API v1 middlewares and routes
// DEPRECATED AND INACTIVE

import express from 'express';
import nconf from 'nconf';
import {NotFound,} from '../libs/errors';

const router = express.Router(); // eslint-disable-line new-cap

const BASE_URL = nconf.get('BASE_URL');

router.all('*', (req, res, next) => {
  const error = new NotFound(`API v1 is no longer supported, please use API v3 instead (${BASE_URL}/apidoc).`);
  return next(error);
});

export default router;
