# Training project: Basket icon

"Shopping cart" is a component of the interface of an online store or restaurant to which users add products to order.

In our project, it consists of two parts, the first is the "Basket Icon" component. It appears on the page when the user adds at least one product to the cart, and disappears when all products are deleted.

In this task, you already have the file `index.js`, which contains the `Cart Icon` class describing this component.

Once the "rendering" of the basket is done in it, you will need to add its positioning when scrolling so that the basket icon is always visible.

Source file `index.js `:

```js
import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  // Draw an empty basket icon
  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  // Fill it with data from the cart object (explained below)
update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  // position the basket icon on the screen
  updatePosition() {
    // your code ...
  }
}
```

Using the Basket icon:

```js
// creating an icon
let cartIcon = new CartIcon();

// adding to the page
document.body.append(cartIcon.elem);

// updating with data from
cartIcon.update(cart);
```

Let's take a closer look at the `update(cart)' method.

## Update(cart) method

The basket icon deals with the fact that it beautifully displays the number of goods and their total cost on the right-top.

The data itself is in the cart's object `cart`.

He has three methods:

```js
let cart = {
  isEmpty() {
    // returns true if the cart is empty and false if not
  },

  getTotalCount() {
    // Returns the total number of items in the cart
  },

  getTotalPrice() {
    // Returns the total amount of all items in the cart
  }
}
```

If the quantity of goods in the cart changes, the external code first updates their quantity in the `cart` object in such a way that the methods `isEmpty`, `getTotalCount`, `getTotalPrice` begin to return new values. After that, it calls the `cartIcon.update(cart)` method, which makes changes to the display of the cart icon:

We will make the real `cart` object a little later, in the file `index.html ` you can see a simplified example of such a bucket object.

As can be seen from the example in the file `index.html `, the basic cart mapping is already working. But if we scroll down the page, we will see that sooner or later the basket icon will remain at the top and become inaccessible. I would like users to see the cart icon always, no matter how hard they scrolled the page. This is what you have to do.

## updatePosition() method

Implement the `updatePosition()` method, which will move the cart icon down and thus make it visible when the user scrolls the page.

In the 'CartIcon' code that already exists, this method is already called in the 'update' method and in the `scroll` and `resize` event handlers (they are added in the 'addEventListeners' method).

So you don't need to call it, you need to write its code.

### Relocation requirements:

The basket icon is visible only if there are products in the basket. Initially, it is located on the top-right of the page.

Before you start moving, you must make sure that the basket icon **is visible** on the page. This can be done, for example, by checking the `offsetHeight` or `offsetWidth` metrics of the root element. You can read more about this in the section - [Размеры и прокрутка элементов: offsetWidth/Height](https://learn.javascript.ru/size-and-scroll#offsetwidth-height)
You need to start moving the basket icon as soon as the upper edge of the icon has left the screen when scrolling.

**Vertically:**
- the basket icon should be `50px` away from the top edge of the screen.

**Horizontally, the icon should:**
- stand at `20px` to the right of the first element in the document with the `container' class.
- at the same time, it should be no closer than `10px` from the right edge of the window.

If the width of the browser window is less than or equal to `767px`, then **there is no need to move the cart icon at all**. This is due to the fact that we use other "mobile" styles at this width. You can see this for yourself in the developer console.

You can see the behavior of the icon in action on the project page <https://course-jsbasic.javascript.ru >.

Please note that due to the fact that this task can be solved in many ways, it is quite difficult to check it automatically. Therefore, if you encounter a situation that everything works as it should in the browser, but the tests do not pass, contact the teacher for help.

### Hint

The following is a description of how to solve this problem. If you want to try to solve it yourself, do not read on ;)

### How is the icon movement technically arranged?

The main idea of moving the basket icon on the page is that if the user scrolled the page to the top edge of the basket icon, set it a fixed positioning (`position: fixed;`).
 Learn more about 'position: fixed` - [вот тут](https://learn.javascript.ru/position#position-fixed).

### Tracking the moment the movement starts

Initially, the icon is positioned using 'position: absolute'. You need to change the positioning to `fixed` and move it only when the edge of the icon has gone beyond the border of the window. And when the page is scrolled back up, you need to return the basket "as it was".

To do this, remember the initial coordinate of the upper border of the basket. It will be the starting point: when the page is scrolled below, there will be a floating basket with `fixed`, and when above, the usual positioning of `absolute`:

```js
// current Y-coordinate relative to the window + current scrolling
let initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
```

This value does not have to be calculated every time, it is enough to calculate it at the first call of the `updatePosition()` method.

We will compare the resulting value with the degree of page scrolling with each new method call:

```js
if (window.pageYOffset > initialTopCoord) {
  // floating basket
} else {
  // basket on top
}
```

If the value of 'window.pageYOffset' is greater than `initialTopCoordinate`, then the user has already scrolled to the top edge of the basket icon, and we need to change its positioning to fixed, and vice versa.

### Calculating the horizontal indentation

And to understand which access to take from the left, you need to calculate two values:

1. The value is so that the indent is `20px` to the right of the first element in the document with the `container' class. To do this, take the distance from the edge of the document of this very first element with the `container' class and add `20px` to it:

```js
document.querySelector('.container').getBoundingClientRect().right + 20;
```

2. The value so that the indent from the right edge of the screen is `10px`. To do this, you need to subtract the width of the basket icon (`this.elem.offsetWidth`) and the size of the margin from the edge (`10px`) from the total width of the page (`document.documentElement.clientWidth`), like this:

```js
document.documentElement.clientWidth - this.elem.offsetWidth - 10;
```

Now you need to choose one of the two values. The correct value for us will be the smallest of them. Let's do it using 'Math.min`:

```js
let leftIndent = Math.min(
  document.querySelector('.container').getBoundingClientRect().right + 20,
  document.documentElement.clientWidth - this.elem.offsetWidth - 10
) + 'px'
```

### Application of fixed positioning

As a result, in order to fixedly position the basket icon on the page, you need:

```js
let leftIndent = Math.min(
  document.querySelector('.container').getBoundingClientRect().right + 20,
  document.documentElement.clientWidth - this.elem.offsetWidth - 10
) + 'px'

Object.assign(this.elem.style, {
  position: 'fixed',
  top: '50px',
  zIndex: 1e3,
  right: '10px',
  left: leftIndent
});
```

Do not forget to return everything as it was when the user scrolled back to the top:

```js
Object.assign(this.elem.style, {
  position: '',
  top: '',
  left: '',
  zIndex: ''
});
```

### Mobile devices

For mobile devices or just for a small window width, we use other styles, where the basket icon is always positioned fixedly. Therefore, if the screen width is less than or equal to `767px`, then the positioning should be reset to the original values. To determine this, we use the `clientWidth' property of the entire document:

```js
let isMobile = document.documentElement.clientWidth <= 767;

// If the condition is met, we reset the styles to the original ones
if (document.documentElement.clientWidth <= 767) {
  Object.assign(this.elem.style, {
    position: '',
    top: '',
    left: '',
    zIndex: ''
  });
}
```
