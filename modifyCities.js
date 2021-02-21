import fs from 'fs';


export default (app) => {
  app.put('/modify_cities', async (req, res) => {
    try {
      const {
        cities
      } = req.body;
      const filePath = `../vintage-maps/scripts/map/cities/data.json`;
      fs.writeFileSync(filePath, JSON.stringify(cities, undefined, 2));
      res.status(200).send({ message: `succesfully updated ${filePath}` });
    }
    catch(e) {
      console.error(e);
      res.status(500).send({ e: e.toString() });
    }
  })
}