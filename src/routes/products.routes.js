const express = require('express');
const productRouter = express.Router();
const fs = require('fs');
const path = require('path');

const prodfile = path.join(__dirname, '../data/products.json');


const products = []


async function getProducts() {
  try {
    const data = await fs.promises.readFile(prodfile);
    const products = JSON.parse(data);
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getProductById(productId) {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
}


productRouter.get('/', (req, res) => {
  const products = getProducts();
  res.json(products);
});

productRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = getProductById(parseInt(pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

async function getNextProductId() {
  try {
    const products = await getProducts();
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  } catch (error) {
    console.error(error);
    return 1;
  }
}

productRouter.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  try {
    let products = await getProducts();
    const newId = await getNextProductId();
    const newProduct = { id: newId, title, description, code, price, status, stock, category, thumbnails };
    products.push(newProduct);
    fs.writeFileSync(prodfile, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


productRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const products = getProducts();
  const index = products.findIndex(p => p.id === parseInt(pid));

  if (index === -1) {
    res.status(404).send('Product not found');
  } else {
    products[index] = {
      id: parseInt(pid),
      title: title || products[index].title,
      description: description || products[index].description,
      code: code || products[index].code,
      price: price || products[index].price,
      status: status || products[index].status,
      stock: stock || products[index].stock,
      category: category || products[index].category,
      thumbnails: thumbnails || products[index].thumbnails
    };
    fs.writeFileSync(prodfile, JSON.stringify(products, null, 2));
    res.json(products[index]);
  }
});


productRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = getProducts();
  const index = products.findIndex(p => p.id === parseInt(pid));

  if (index === -1) {
    res.status(404).send('Product not found');
  } else {
    products.splice(index, 1);
    fs.writeFileSync(prodfile, JSON.stringify(products, null, 2));
    res.status(204).send();
  }
});

module.exports = productRouter;
