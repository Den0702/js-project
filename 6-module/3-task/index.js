import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.elem = createElement(
      `<div class="carousel">
        <!--Кнопки переключения-->
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
        <div class="carousel__inner" >
        </div> 
      </div>`
    );
    this.carouselInner = this.elem.querySelector('.carousel__inner');
    this.createSlides();
    this.addEventListeners();
    this.rightArrow = this.elem.querySelector('.carousel__arrow_right');
    this.leftArrow = this.elem.querySelector('.carousel__arrow_left');
    this.position = 0;
    this.currentSlideNumber = 0;
    this.update();
  }

  createSlides() {
    //let carouselInner = this.elem.querySelector('.carousel__inner');

    const slidesHtmlString = this.slides.map(slide =>
      `
      <div class="carousel__slide" data-id="${slide.id}">
          <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
            <div class="carousel__caption">
              <span class="carousel__price">${slide.price.toFixed(2)}</span>
              <div class="carousel__title">${slide.name}</div>
              <button type="button" class="carousel__button">
                <img src="/assets/images/icons/plus-icon.svg" alt="icon">
              </button>
            </div>
        </div>`
    ).join('');
    this.carouselInner.insertAdjacentHTML('beforeend', slidesHtmlString);
  }

  addEventListeners() {
    this.elem.addEventListener('click', event => {
      if (event.target.closest('.carousel__button')) {
        let id = event.target.closest('[data-id]').dataset.id;
        this.elem.dispatchEvent(new CustomEvent("product-add", {
          detail: id,
          bubbles: true,
        }));
      }
    });
    this.elem.onclick = () => {
      this.shift = this.carouselInner.offsetWidth;
      const target = event.target;
      if (target.closest('.carousel__arrow_right')) {
        this.right();
      }
      else if (target.closest('.carousel__arrow_left')) {
        this.left();
      }
    }
  }

  left() {
    this.currentSlideNumber--;
    this.update();
  }

  right() {
    this.currentSlideNumber++;
    this.update();
  }

  update() {
    this.position = -this.shift * this.currentSlideNumber; 
    this.carouselInner.style.transform = `translateX(${this.position}px)`;
    
    if (this.currentSlideNumber < this.slides.length - 1) {
      this.rightArrow.style.display = '';
    } else {
      this.rightArrow.style.display = 'none';
    }
  
    if (this.currentSlideNumber > 0) {
      this.leftArrow.style.display = '';
    } else {
      this.leftArrow.style.display = 'none';
    }
  }

}