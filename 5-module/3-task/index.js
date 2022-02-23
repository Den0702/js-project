function initCarousel() {
  let currentSlideNumber = 0;
  let slidesAmount = 4;
  let elem = document.querySelector('[data-carousel-holder]');

  let carouselInnerElem = elem.querySelector('.carousel__inner');//зачем нужен carousel__inner? Почему carousel-holder c data?
  let carouselArrowRight = elem.querySelector('.carousel__arrow_right');
  let carouselArrowLeft = elem.querySelector('.carousel__arrow_left');

  update();//инициализация- задание начального состояния слайда(стрелка)

  elem.onclick = ({target}) => {
    if (target.closest('.carousel__arrow_right')) {//можно ли обойтись без метода closest?
      next();
    }

    if (target.closest('.carousel__arrow_left')) {
      prev();
    }
  };

  function next() {
    currentSlideNumber++;
    update();
  }

  function prev() {
    currentSlideNumber--;
    update();
  }

  function update() {
    let offset = -carouselInnerElem.offsetWidth * currentSlideNumber;
    carouselInnerElem.style.transform = `translateX(${offset}px)`;

    if (currentSlideNumber == slidesAmount - 1) {
      carouselArrowRight.style.display = 'none';
    } else {
      carouselArrowRight.style.display = '';
    }

    if (currentSlideNumber == 0) {
      carouselArrowLeft.style.display = 'none';
    } else {
      carouselArrowLeft.style.display = '';
    }
  }
}
