const productCardsContainer = document.querySelector('.product-cards');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const topProductButton = document.getElementById('top-product-button');
    const sidebar = document.getElementById('sidebar');

    let products = generateProducts(20);
    let currentPage = 0;

    function generateProducts(num) {
      const names = ['Notebook', 'Phone', 'Headphones', 'Tablet', 'Laptop', 'Keyboard', 'Mouse', 'Monitor', 'Webcam', 'Speaker', 'Charger', 'Case', 'Screen Protector', 'Cable', 'Power Bank', 'Gamepad', 'VR Set', 'Smartwatch', 'Camera', 'Printer'];
      const descriptions = ['A very fast and reliable product.', 'The latest and greatest device.', 'Premium sound quality.', 'Compact and portable.', 'Powerful and portable.', 'Comfortable and responsive.', 'Precise and comfortable.', 'Crisp and clear visuals.', 'High-quality video calls.', 'Crystal clear audio.', 'Fast and efficient charging.', 'Protective and stylish.', 'Protect your screen.', 'Connect and charge.', 'Long-lasting power.', 'Play like a pro.', 'Immerse in virtual reality.', 'Stay connected and track your health.', 'Capture moments.', 'Print documents and photos.'];
      const prices = Array.from({ length: num }, () => Math.floor(Math.random() * 1000 + 350));
      const ratings = Array.from({ length: num }, () => Math.floor(Math.random() * 10) + 10);

      return Array.from({ length: num }, (_, i) => {
        return {
          id: i,
          name: names[i % names.length],
          description: descriptions[i % descriptions.length],
          price: prices[i],
          rating: ratings[i] / 2,
          image: `https://via.placeholder.com/150?text=Product+${i + 1}`,
        };
      });
    }

    function fetchMemeImages() {
      fetch('https://api.imgflip.com/get_memes')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const memes = data.data.memes.slice(0, 20);
            products = products.map((product, index) => {
              const meme = memes[index];
              return {
                ...product,
                image: meme.url,
                // opcionalis: name: meme.name,
              };
            });
            displayProducts(products.slice(currentPage * 10, currentPage * 10 + 10));
          } else {
            console.error('Failed to fetch memes:', data.error_message);
          }
        })
        .catch(error => {
          console.error('Error fetching memes:', error);
        });
    }

    fetchMemeImages();

    function generateProductCard(product, fullSizeImage = false) {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.name;
      if (fullSizeImage) {
        image.setAttribute('fullSizeImage', '');
      }

      const title = document.createElement('h2');
      title.textContent = product.name;

      const description = document.createElement('p');
      description.textContent = product.description;

      const price = document.createElement('p');
      price.classList.add('price');
      price.textContent = `${product.price} EUR`;

      const rating = document.createElement('p');
      rating.classList.add('rating');
      rating.textContent = `${product.rating}/10`;

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(price);
      card.appendChild(rating);

      return card;
    }

    


    function updatePaginationButtons() {
  if (currentPage === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage >= Math.ceil(products.length / 10) - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
}

function displayProducts(productsToDisplay) {
  productCardsContainer.innerHTML = '';
  for (const product of productsToDisplay) {
    productCardsContainer.appendChild(generateProductCard(product));
  }
  updatePaginationButtons(); 
}

//4
function handlePrev() {
  if (currentPage > 0) {
    currentPage--;
    displayProducts(products.slice(currentPage * 10, currentPage * 10 + 10));
  }
}

function handleNext() {
  if (currentPage < Math.ceil(products.length / 10) - 1) {
    currentPage++;
    displayProducts(products.slice(currentPage * 10, currentPage * 10 + 10));
  }
}

//6
function searchProductsByName() {
  const searchText = searchInput.value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
  currentPage = 0; 
  displayProducts(filteredProducts.length ? filteredProducts.slice(0, 10) : []);
}

displayProducts(products.slice(0, 10)); 

//7
const determineTopProduct = (productList) => {
  return productList.reduce((topProduct, currentProduct) => {
    return (topProduct.rating > currentProduct.rating) ? topProduct : currentProduct;
  });
};

function showTopProduct(productList) {
  const topProduct = determineTopProduct(productList);
  const topProductCard = generateProductCard(topProduct);
  const topProductContainer = document.getElementById('top-product-container');

  topProductContainer.innerHTML = '';
  topProductContainer.appendChild(topProductCard);
}
    function openSidebar() {
      sidebar.classList.add('open');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
    }

    topProductButton.addEventListener('click', () => {
      openSidebar();
      showTopProduct(products);
    });




prevButton.addEventListener('click', handlePrev);
nextButton.addEventListener('click', handleNext);
searchButton.addEventListener('click', searchProductsByName);