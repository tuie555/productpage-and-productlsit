let products = [];

fetch('http://x526d.3bbddns.com:19545/PullPro')
  .then(response => response.json())
  .then(data => {
    products = data;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    showDetail(productId);
  })
  .catch(error => {
    console.error('Error:', error);
  });

function showDetail(productId) {
  // remove datas default from HTML
  const detail = document.querySelector('.detail');
  const listProduct = document.querySelector('.listProduct');
  const thisProduct = products.filter(value => value.id == productId)[0];
  //if there is no product with id = productId => return to home page
  if (!thisProduct) {
    window.location.href = "/";
  }

  const imageContainer = detail.querySelector('.image');
  if (imageContainer) {
    const img = document.createElement('img');
    img.src = thisProduct.image;
    img.alt = `Product Image`;
    imageContainer.appendChild(img);
  } else {
    console.log('Image container not found');
  }

  const contentContainer = document.querySelector('.content');
  if (contentContainer) {
    contentContainer.querySelector('.name').innerText = thisProduct.name;
    contentContainer.querySelector('.price').innerText = thisProduct.price;
    contentContainer.querySelector('.description').innerText = thisProduct.description;
    contentContainer.querySelector('.sellerName').innerHTML = thisProduct.seller;
    document.querySelector('.product-name').innerText = thisProduct.name;
  } else {
    console.log('Content container not found');
  }

  document.querySelector('.product-name').innerText = thisProduct.name;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (product.id != productId) {
      const newProduct = document.createElement('a');
      newProduct.href = '/client/detail.html?id=' + product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <img src="${product.image}" alt="">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
      `;
      listProduct.appendChild(newProduct);
    }
  }
}
