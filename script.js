const itemsList = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');
const atualPrice = document.querySelector('.only_valor');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  // coloque seu código aqui
  const element = event.target;
  element.parentElement.removeChild(element);
  saveCartItems(cartList.childNodes); 
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getTotalPrice = (valor) => {
  let totalValor = parseFloat(atualPrice.innerText) + valor;
  totalValor = totalValor.toString().split('.');
  if (totalValor.length > 1 && totalValor[1].length > 2) {
    totalValor[1] = `${totalValor[1][0]}${totalValor[1][1]}`;
  }
  totalValor = totalValor.join(separator = '.');
  atualPrice.innerText = totalValor;
};

const addToCart = async (event) => {
  const element = event.target;
  const itemId = getSkuFromProductItem(element.parentElement);
  const price = await fetchItem(itemId);
  const itemObject = {
    sku: itemId,
    name: element.parentElement.querySelector('.item__title').innerText,
    salePrice: price.price,
  };
  cartList.appendChild(createCartItemElement(itemObject));
  saveCartItems(cartList.childNodes);
  getTotalPrice(itemObject.salePrice);
};

const btnAddToCart = () => {
  const buttonList = document.querySelectorAll('.item__add');
  buttonList.forEach((button) => {
    button.addEventListener('click', addToCart);
  });
};

const createListOfProducts = async () => {
  const list = await fetchProducts('computador');
  const readyList = list.map((element) => ({
    sku: element.id,
    name: element.title,
    image: element.thumbnail,
  }));
  readyList.forEach((element) => {
    itemsList.appendChild(createProductItemElement(element));
  });
  btnAddToCart();
};

const getSavedCart = (items) => {
  for (let i = 1; i < items.length; i += 1) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = items[i];
    li.addEventListener('click', cartItemClickListener);
    cartList.appendChild(li);
  }
};

window.onload = () => {
  createListOfProducts();
  getSavedCart(getSavedCartItems());
};
