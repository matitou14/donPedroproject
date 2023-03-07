const fs = require('fs');
const cartFile = ['carts.json'];
const productFile = require ('../data/products.json');

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
  
  module.exports = {
    getCarts,
    getCartById,
    getProducts,
    getProductById,
    };
