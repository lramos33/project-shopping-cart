function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
 
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

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

async function addItemsToCart(id) {
  const item = fetch(`https://api.mercadolibre.com/items/${id}`);
  const olCartItems = document.querySelector('.cart__items');

  await item
    .then((response) => response.json())
    .then((element) => olCartItems.appendChild(createCartItemElement({
      sku: element.id,
      name: element.title,
      salePrice: element.price,
    })));
}

function getProductId() {
    const allAddCartButtons = document.querySelectorAll('.item__add');
    allAddCartButtons.forEach((button) => button.addEventListener('click', (event) => {
      const itemId = event.target.parentNode.firstChild.innerText;
      addItemsToCart(itemId);
    }));
}

window.onload = async () => { 
  await fetchItems();
  getProductId();
};