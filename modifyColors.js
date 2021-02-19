import fs from 'fs';


export default (app) => {
  app.put('/modify_colors', async (req, res) => {
    try {
      const {
        styleName,
        colors,
      } = req.body;
      const filePath = `../vintage-maps/scripts/map/colors.json`;
      const fileColors = JSON.parse(fs.readFileSync(filePath, {encoding:'utf8'}));
      
      fileColors[styleName] = colors;
      fs.writeFileSync(filePath, JSON.stringify(fileColors, undefined, 2));
      res.status(200).send({ styleName, message: `succesfully updated ${styleName} on ${filePath}` });
    }
    catch(e) {
      console.error(e);
      res.status(500).send({ e: e.toString() });
    }
  })
}