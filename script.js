// Constantes globais
const cartItems = document.querySelector('.cart__items');

// Salva todos os itens no localStorage.
function saveCart() {
  localStorage.setItem('cartContent', cartItems.innerHTML);
}

// [TRYBE]
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// [TRYBE]
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// [TRYBE]
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
 
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// [TRYBE]
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// [HELP]
function getPrices() {
  const totalPriceSection = document.querySelector('.total-price');
  const allPrices = document.querySelectorAll('.price');
  const prices = [];
  allPrices.forEach((element) => prices.push(parseFloat(element.innerHTML)));
  if (prices.length > 0) {
    const finalPrice = prices.reduce((acc, curr) => acc + curr);
    totalPriceSection.innerText = `${finalPrice}`;
  } else {
    totalPriceSection.innerText = '0';
  }
}

// Remove o elemento clicado e chama a função para atualizar o localStorage.
function cartItemClickListener(event) {
  event.target.remove();
  // event.target.parentNode.removeChild(event.target);
  saveCart();
  getPrices();
}

// [TRYBE]
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class="price">${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Faz a requisição de todos os itens e chama a função (line: ) para adicionar todos eles na página via html.
async function fetchItems() {
  const computers = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const sectionItems = document.querySelector('.items');

  await computers
    .then((response) => response.json())
    .then((response) => response.results)
    .then((response) => response.forEach((element) => 
      sectionItems.appendChild(createProductItemElement({
        sku: element.id, 
        name: element.title, 
        image: element.thumbnail,
      }))));
}

// Faz a requisição do item e depois chama a função para adicionar ao carrinho via html. Por fim executa a função (line: ) que salva no localStorage.
async function addItemsToCart(id) {
  const item = fetch(`https://api.mercadolibre.com/items/${id}`);

  await item
    .then((response) => response.json())
    .then((element) => {
      cartItems.appendChild(createCartItemElement({
        sku: element.id,
        name: element.title,
        salePrice: element.price,
      }));
    });
  getPrices();
  saveCart();
}

// Captura o id do item clicado e usa esse id para chamar a função (line: ) que adiciona o item ao carrinho.
function getProductId() {
    const allAddCartButtons = document.querySelectorAll('.item__add');
    allAddCartButtons.forEach((button) => button.addEventListener('click', (event) => {
      const itemId = event.target.parentNode.firstChild.innerText;
      addItemsToCart(itemId);
    }));
}

// Remonta o carrinho com os dados do localStorage.
function bringCartBack() {
  cartItems.innerHTML = localStorage.getItem('cartContent');
  cartItems.childNodes.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

// Remove todos os elementos dentro do carrinho e depois salva no localStorage.
function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cartItem = document.querySelectorAll('.cart__item');
    cartItem.forEach((element) => element.remove());
    getPrices();
    saveCart();
  });
}

window.onload = async () => { 
  await fetchItems();
  bringCartBack();
  getPrices();

  getProductId();
  emptyCart();
};