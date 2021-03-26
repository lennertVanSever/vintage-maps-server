import "dotenv/config.js"
import express from 'express';
import printKey from './printKey.js';
import uploadMap from './uploadMap.js';
import modifyCountry from './modifyCountry.js';
import modifyMountains from './modifyMountains.js';
import modifyColors from './modifyColors.js';
import modifyCities from './modifyCities.js';
import stripe from './stripe.js';
import cors from 'cors';
import { initializeSentry, forceLoggingErrors} from './sentry.js'
import 'express-async-errors';

const app = express()

const port = process.env.PORT || 9000;
app.use(express.json({ limit: '100mb' }))
app.use(cors())
initializeSentry(app);

printKey(app);
uploadMap(app);
modifyCountry(app);
modifyCities(app);
modifyColors(app);
modifyMountains(app);
stripe(app);
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
})

forceLoggingErrors(app);