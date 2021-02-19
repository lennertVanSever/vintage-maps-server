import "dotenv/config.js"
import express from 'express';
import printKey from './printKey.js';
import uploadMap from './uploadMap.js';
import modifyCountry from './modifyCountry.js';
import modifyColors from './modifyColors.js';
import cors from 'cors';

const app = express()
const port = process.env.PORT || 9000;
app.use(express.json({ limit: '100mb' }))
app.use(cors())


printKey(app);
uploadMap(app);
modifyCountry(app);
modifyColors(app);
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
})
