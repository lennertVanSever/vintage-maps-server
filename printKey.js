import fetch from "node-fetch";
import { throwErrorIfNotStatus200 } from './utils.js';

const {
  PRINT_CLIENT_ID,
  PRINT_CLIENT_SECRET,
  PRINT_ORIGIN
} = process.env;

const fetchAuthorizationToken = async () => {
  const responseRaw = await fetch(`${PRINT_ORIGIN}/v2/oauth`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': PRINT_CLIENT_ID,
      'client_secret': PRINT_CLIENT_SECRET
    }),
  });
  return throwErrorIfNotStatus200({
    responseRaw,
  });
}

export default (app) => {
  app.get('/print_key', async (req, res, next) => {
    const now = new Date();
    console.info('request href', req.headers['x-request-href'], now.toString());
    const token = await fetchAuthorizationToken();
    res.send({ ...token, api_url: PRINT_ORIGIN });
  })
}