import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value; 
    this.elem = createElement(
      `<div class="slider">
        <!--Ползунок слайдера с активным значением-->
        <div class="slider__thumb" style="left: 50%;">
          <span class="slider__value">2</span>
        </div>

        <!--Заполненная часть слайдера-->
        <div class="slider__progress" style="width: 50%;"></div>

        <!--Шаги слайдера-->
        <div class="slider__steps">
        </div>
      </div>`
    );
    this.createSteps();
  }
  createSteps() {
    let div = this.elem.querySelector('.slider__steps');
    for (let i = 0; i < this.steps; i++) {
      div.insertAdjacentHTML('afterbegin', '<span>');   
    }
  }
}