import fs from 'fs';


export default (app) => {
  app.put('/modify_mountains', async (req, res) => {
    try {
      const {
        mountains
      } = req.body;
      const filePath = `../vintage-maps/scripts/map/mountains/data.json`;
      fs.writeFileSync(filePath, JSON.stringify(mountains));
      res.status(200).send({ message: `succesfully updated ${filePath}` });
    }
    catch(e) {
      console.error(e);
      res.status(500).send({ e: e.toString() });
    }
  })
}