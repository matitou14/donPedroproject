const socket = io();

const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    const name = addProductForm.elements.name.value;
    const price = addProductForm.elements.price.value;
    socket.emit('add-product', {name, price})
});

const deleteButtons = document.querySelectorAll('.delete-product');
deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-id');
    socket.emit('delete-product', { id });
  });
});

socket.on('products', (updatedProducts) => {
    const productList = document.querySelector('ul');
    productList.innerHTML = updatedProducts.map((product) => `
      <li>
        ${product.name} - $${product.price}
        <button class="delete-product" data-id="${product.id}">Eliminar</button>
      </li>
    `).join('');
  });
  