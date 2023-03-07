const express = require('express');
const cartRouter = express.Router();
const fs = require('fs');
const path = require('path');

const cartFile = path.join(__dirname, '../data/carts.json');
const productFile = path.join(__dirname, '../data/products.json');

let carts = [];
let count = 1;

function getCarts() {
    const data = fs.readFileSync(cartFile);
    const carts = JSON.parse(data);
    return carts;
}

function getCartById(cartId) {
    const carts = getCarts();
    const cart = carts.find(c => c.id === cartId);
    return cart;
}

function getProducts() {
    const data = fs.readFileSync(productFile);
    const products = JSON.parse(data);
    return products;
}

function getProductById(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    return product;
}

cartRouter.post('/', (req, res) => {
    const newId = count++;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    fs.writeFileSync(cartFile, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});
cartRouter.get('/', (req, res) => {
    const carts = getCarts();
    res.json(carts);
  });
  cartRouter.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    const cart = getCartById(parseInt(cid));
    if (!cart) {
      res.status(404).send('Cart not found');
      return;
    }
  
    const product = getProductById(parseInt(pid));
    if (!product) {
      res.status(404).send('Product not found');
      return;
    }
  
    // Check if the product is already in the cart
    const existingProduct = cart.products.find(p => p.id === pid);
    if (existingProduct) {
      // If the product already exists in the cart, update its quantity
      existingProduct.quantity += parseInt(quantity);
    } else {
      // If the product doesn't exist in the cart, add it with the given quantity
      const newProduct = { id: pid, quantity: parseInt(quantity) };
      cart.products.push(newProduct);
    }
  
    // Write the updated cart to the file
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));
  
    // Return the updated cart
    res.status(201).json(cart);
});

  

  module.exports = cartRouter;