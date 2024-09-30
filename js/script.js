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

  const sliderContainer = document.querySelector('.slider');
  const productImages = thisProduct.images;

  if (productImages) {
    productImages.forEach((image, index) => {
      const img = document.createElement('img');
      img.src = `${product.image}`;
      img.alt = `Product Image ${index + 1}`;
      if (index === 0) {
        img.classList.add('active');4
      }
      sliderContainer.appendChild(img);
    });
  }

  let currentImage = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      nextImage();
    } else if (touchEndX - touchStartX > 50) {
      prevImage();
    }
  });

  function nextImage() {
    const images = sliderContainer.children;
    images[currentImage].classList.remove('active');
    currentImage = (currentImage + 1) % images.length;
    images[currentImage].classList.add('active');
  }

  function prevImage() {
    const images = sliderContainer.children;
    images[currentImage].classList.remove('active');
    currentImage = (currentImage - 1 + images.length) % images.length;
    images[currentImage].classList.add('active');
  }

  detail.querySelector('.name').innerText = thisProduct.name;
  detail.querySelector('.price').innerText = '฿' + thisProduct.price;
  detail.querySelector('.description').innerText = thisProduct.description;

  const sellerProfile = document.createElement('div');
  sellerProfile.classList.add('seller-profile');
  sellerProfile.innerHTML = `
    <h2>Seller Profile</h2>
    <img src="./UserIcon.png" alt="${thisProduct.seller.name}">
    <h3>"test"</h3>
    <button class="chat-to-seller" onclick="openChat()">Chat to Seller</button>
  `;
  detail.querySelector('.content').insertBefore(sellerProfile, detail.querySelector('.content').firstChild);

  products.forEach(product => {
    if (product.id != productId) {
      const newProduct = document.createElement('a');
      newProduct.href = '/detail.html?id=' + product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <img src="${product.image[0]}" alt="">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
      `;
      listProduct.appendChild(newProduct);
    }
  });
}