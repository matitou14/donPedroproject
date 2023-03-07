const express = require('express');
const fs = require('fs');
const path = require('path');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const productListPath = path.join(__dirname, '..', 'data', 'products.json');
      const data = await fs.promises.readFile(productListPath, 'utf8');
      const productos = JSON.parse(data);
      res.render('index', { productos });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de productos');
    }
  });



  router.get('/realtimeproducts', async (req, res) => {
    try {
      const productListPath = path.join(__dirname, '..', 'data', 'products.json');
      const data = await fs.promises.readFile(productListPath, 'utf8');
      const productos = JSON.parse(data);
      res.render('realTimeProducts', { productos });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo de productos');
    }
  });

module.exports = router;