"use strict";

class Drink {
  #label;
  #price;
  #category;
  #special;

  constructor(label, price, category, special) {
    this.#label = label;
    this.#price = price;
    this.#category = category;
    this.#special = special;
  }

  get name() {
    return this.#label;
  }

  get price() {
    return this.#price;
  }

  get type() {
    return this.#category;
  }

  get limited() {
    return this.#special;
  }
}

class Cart {
  constructor() {
    this.cart = [];
  }

  get shoppingCart() {
    return this.cart;
  }

  addToCart(item) {
    const existingProduct = this.cart.find(
      (product) => product.item.name === item.name
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.cart.push({ item, quantity: 1 });
    }

    console.log("Im Einkaufswagen: ", this.cart);
  }

  removeFromCart(product) {
    const index = this.cart.indexOf(product);
    if (index !== -1) {
      this.cart.splice(index, 1);
      console.log("Aktualisierter Warenkorb:", this.cart);
      updateOrder(this);
    }
  }
}

function getAllCategories(list) {
  const categories = [];

  for (const item of list) {
    if (!categories.includes(item.type)) {
      categories.push(item.type);
    }
  }

  return categories;
}

function getAllItemsOfType(menu, type) {
  const allItems = [];

  menu.forEach((item) => {
    if (item.type === type) {
      allItems.push(item);
    }
  });

  console.log(allItems);

  return allItems;
}

// ----------- DOM Manipulation -----------
function createTag(
  parentNode,
  tagNode,
  idName = null,
  className = null,
  content = null
) {
  const tag = document.createElement(tagNode);

  parentNode.append(tag);

  if (idName != null) {
    tag.id = idName;
  }

  if (className != null) {
    tag.className = className;
  }

  if (content != null) {
    tag.innerHTML = content;
  }

  return tag;
}

function createItemCards(categoryNode, allItems, order) {
  allItems.forEach((item) => {
    let card;
    if (item.limited) {
      card = createTag(categoryNode, "div", null, "card limited");
    } else {
      card = createTag(categoryNode, "div", null, "card");
    }

    createTag(
      card,
      "div",
      null,
      "card-header",
      '<i class="fa-solid fa-mug-saucer"></i>'
    );

    const body = createTag(card, "div", null, "card-body");
    createTag(body, "h3", null, "card-name", item.name);
    if (item.limited) {
      createTag(body, "h5", null, "special", "nur für kurze Zeit!");
    }
    createTag(body, "h4", null, "card-price", item.price);

    const footer = createTag(card, "div", null, "card-footer");
    const addBtn = createTag(footer, "i", "add-btn", "fa-solid fa-square-plus");
    addBtn.addEventListener("click", () => {
      order.addToCart(item);
      updateOrder(order);
    });
  });
}

function createMenu(menulist, order) {
  const menuSection = document.getElementById("menu");
  const categories = getAllCategories(menulist);

  console.log("Alle Kategorien:", categories);
  categories.forEach((category) => {
    let tmp = category.replace(/ /g, "-");
    const categorySection = createTag(
      menuSection,
      "div",
      tmp.toLowerCase(),
      "category"
    );

    createTag(categorySection, "h3", null, "category-name", category);
    const itemsOfCategory = getAllItemsOfType(menulist, category);
    createItemCards(categorySection, itemsOfCategory, order);
  });
}

function updateOrder(order) {
  const orderSection = document.getElementById("order");
  orderSection.innerHTML = "";

  const orderList = createTag(orderSection, "ul");
  order.shoppingCart.forEach((product) => {
    const listItem = createTag(orderList, "li");
    createTag(
      listItem,
      "span",
      null,
      null,
      `${product.quantity}x ${product.item.name}`
    );
    const removeBtn = createTag(
      listItem,
      "i",
      null,
      "fa-solid fa-rectangle-xmark"
    );
    removeBtn.addEventListener("click", () => {
      order.removeFromCart(product);
    });
  });
}

function init() {
  const menu = [
    new Drink("Espresso", 2.6, "Kaffee", false),
    new Drink("Cappuccino", 3.8, "Kaffee", false),
    new Drink("Caffé Latte", 4.1, "Kaffee", false),
    new Drink("Earl Grey", 3.1, "Tee", false),
    new Drink("Pfefferminze", 3.1, "Tee", false),
    new Drink("Früchtekorb", 3.1, "Tee", false),
    new Drink("Kurkuma Latte", 4.2, "Tee", true),
    new Drink("Matcha Latte", 4.2, "Tee", true),
    new Drink("Strawberry Swirl", 4.3, "Shake", false),
    new Drink("Tropical Adventure", 4.3, "Shake", false),
    new Drink("Blue Infusion", 4.3, "Shake", true),
  ];

  console.log("Unser Menue:");
  menu.forEach((drink) => {
    console.log(`${drink.name} um ${drink.price}`);
  });

  const order = new Cart();

  createMenu(menu, order);
}

init();
