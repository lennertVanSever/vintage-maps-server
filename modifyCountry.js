import fs from 'fs';


export default (app) => {
  app.put('/modify_country', async (req, res) => {
    try {
      const {
        mapName,
        countryName,
        changeProperties
      } = req.body;
      const filePath = `../vintage-maps/maps/${mapName}.geojson`;
      const world = JSON.parse(fs.readFileSync(filePath, {encoding:'utf8'}));
      let selectedCountryIndex;
      
      world.features.forEach(({ properties: { NAME }}, index) => {
        if(NAME === countryName) {
          selectedCountryIndex = index;
        }
      })
      if (!selectedCountryIndex) {
        throw Error('country not found, provide correct `countryName`')
      }
      world.features[selectedCountryIndex].properties = changeProperties;
      fs.writeFileSync(filePath, JSON.stringify(world));
      res.status(200).send({ countryName, message: `succesfully updated ${countryName} on ${filePath}` });
    }
    catch(e) {
      console.error(e);
      res.status(500).send({ e: e.toString() });
    }
  })
}