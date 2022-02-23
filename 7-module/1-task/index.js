import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    
    this.render();
    this.elem.addEventListener('click', (event) => this.move(event));
    this.ribbonInner.addEventListener("scroll", (event) => this.arrowsVisibility(event));
  }
  
  render() {
    this.elem = createElement(
      `
        <!--Корневой элемент RibbonMenu-->
        <div class="ribbon">
          <!--Кнопка прокрутки влево-->
          <button class="ribbon__arrow ribbon__arrow_left">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </button>
      
          <!--Ссылки на категории-->
          <nav class="ribbon__inner">
          </nav>
      
          <!--Кнопка прокрутки вправо-->
          <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
            <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </button>
        </div>
      `
    );
    this.ribbonInner = this.elem.querySelector('.ribbon__inner');
    this.leftArrow = this.elem.querySelector('.ribbon__arrow.ribbon__arrow_left');
    this.rightArrow = this.elem.querySelector('.ribbon__arrow.ribbon__arrow_right');
    
    
    for (let category of this.categories) {
      let ribbonItem = createElement(`<a href="#" class="ribbon__item"></a>`);
      ribbonItem.dataset.id = category['id'];
      ribbonItem.insertAdjacentText('afterbegin', category['name']);
      this.ribbonInner.append(ribbonItem);
    }
    this.ribbonInner.firstElementChild.classList.add('ribbon__item_active');
  }

  move(event) {
    if (event.target.closest('.ribbon__arrow.ribbon__arrow_left')) {
      this.ribbonInner.scrollBy(-350, 0);
    } else if (event.target.closest('.ribbon__arrow.ribbon__arrow_right')) {
      this.ribbonInner.scrollBy(350, 0);
    }
  }

  arrowsVisibility(event) {
    let scrollRight = this.ribbonInner.scrollWidth - (this.ribbonInner.scrollLeft + this.ribbonInner.clientWidth);
    
    if (this.ribbonInner.scrollLeft > 0) {
      this.leftArrow.classList.add('ribbon__arrow_visible');//pokazać przycisk
    } else {
      this.leftArrow.classList.remove('ribbon__arrow_visible');
    }
    if (scrollRight > 1) {
      this.rightArrow.classList.add('ribbon__arrow_visible');
    } else {
      this.rightArrow.classList.remove('ribbon__arrow_visible');
    }
  }
  
}