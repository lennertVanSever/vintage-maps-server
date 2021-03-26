import fetch from "node-fetch";
import { throwErrorIfNotStatus200 } from './utils.js';

const {
  PRINT_CLIENT_ID,
  PRINT_CLIENT_SECRET
} = process.env;

const fetchAuthorizationToken = async () => {
  const responseRaw = await fetch("https://test.printapi.nl/v2/oauth", {
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
    try {
      const tokenRaw = await fetchAuthorizationToken();
      const token = await tokenRaw.json();
      res.status(tokenRaw.status).send(token);
    } catch(error) {
      next(error);
    }
  })
}