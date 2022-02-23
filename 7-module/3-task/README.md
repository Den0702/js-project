# Training project: Step-by-step Slider, Part 1

A slider is an interface component that allows the user to select a numeric value within the specified limits.

In modern browser HTML, it is represented by an input with a special type:

```html
<input type="range" id="volume" name="volume" min="0" max="11">
```

But it is not always suitable for complex projects, because it is limited in the possibilities of changing the design and functionality. Therefore, we will create our own slider that fully meets our requirements.

We will use it to select the maximum sharpness of the goods. This is necessary in order to show in the list of products only those that correspond to the specified maximum sharpness.

In this task, we will create a slider that changes its value on click. And in the next one, we will add the possibility of "dragging" the slider (this is not necessary yet).

Create a `Step Slide' class describing the "Step Slider" component (for simplicity, we'll just call it a slider).

An object with two properties is passed as an argument to the class constructor:

```js
let config = {
  steps: 5, //the number of slider steps starts from zero, i.e. the steps in this case will be 0-1-2-3-4
  value: 0 // initial value, current selected step
}

let stepSlider = new StepSlider(config);
```

After that, the root DOM element of the slider should be available in 'stepSlider.elem'.

The layout can be viewed in the file `static.html `, and the usage example is in the file `index.html `.

## Rendering layout

A few comments on the layout of the slider:

```html
<!--Slider Root element-->
<div class="slider">

  <!--Slider thumb with active value-->
  <div class="slider__thumb">
    <span class="slider__value">0</span>
  </div>

  <!--Slider Strip-->
  <div class="slider__progress"></div>

  <!-- Slider steps (vertical dashes) -->
  <div class="slider__steps">
    <!-- the currently selected step is highlighted by this class -->
    <span class="slider__step-active"></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
```

The number of `span' elements inside an element with the `slider__steps' class must correspond to the number of steps from the `steps` property of the object passed at the time of slider creation.

The `elem' property should contain a reference to the root element with the `slider' class.

## Changing the slider value

The range of possible slider values is from '0` to 'config.steps` (not inclusive), while the slider can accept only specific values of steps, without intermediate ones (without fractions). 

Let's look at this in a detailed example. 

Let's say we created a slider with 5 steps:

```js
let config = {
  steps: 5, // Количество шагов
  value: 0
}
let slider = new StepSlider(config);
```

The values must start from zero, the possible values of the slider are from 5 steps - `0, 1, 2, 3, 4`. 

Further explanation is given for these 5 steps, but the number of steps can be any.

We will also introduce the concept of a "slider segment" - the gap between the marks of the slider steps. For a slider with 5 steps, there will be 4 segments, i.e. 'config.steps - 1'.

## How to visually change the value?

Implement the slider value change when you click on it.

It is recommended to hang the click event handler on the root element of the slider with the `slider' class. 

- If the click occurred at a particular step, for example, at `2`, then we change the value to the value of this step. 
- The click can also be not exactly on a step, but between steps, then you need to choose the step to which the cursor was closer at the time of the click.

Recall that for a slider of 5 steps, the value must be from the range `0, 1, 2, 3, 4`.

Write the code to determine the next step yourself.

After you have defined a new slider value, you need to display it:

1. Write a new value inside the element with the `slider__value' class.
2. Visually highlight the step on the slider by adding the `slider__step-active' class to the `span' element inside the element with the `slider__steps' class. For example, if the value is 3, then you need to select the 4th 'span', because our score starts from 0.
3. Change the position of the slider (an element with the `slider__thumb' class` by setting it 'left` in styles.
4. Expand the shaded area to a slider (an element with the `slider__progress' class` by changing its width. 

The following is an approximate implementation for items '3-4`

```js
// this.elem - link to the slider root element
let thumb = this.elem.querySelector('.slider__thumb');
let progress = this.elem.querySelector('.slider__progress');

let leftPercents = 55; // Percentage value from 0 to 100

thumb.style.left = `${leftPercents}%`;
progress.style.width = `${leftPercents}%`;
```

Please note that all values must be in %, the layout is focused on percentages. 

The specific values depend on the click, calculate them yourself.

## Generating a custom event

Whenever the slider value changes, you need to generate a 'sliderchange' event with this value on the root element of the slider, like this:

```js
new CustomEvent('slider-change', { // the event name should be exactly 'sliderchange'
  detail: this.value, // value 0, 1, 2, 3, 4
  bubbles: true // the event pops up - it will be needed in the future
})
```

This way the external code will be able to find out about slider changes.

## Hint

If you want to solve the problem yourself, do not read on ;)

### How do I move the slider and get the value?

The code below should be written inside the `click' event handler.

To begin with, let's determine the distance from the beginning of the slider element to the place where the cursor was at the time of the click. We will use coordinates relative to the window. Let's take the horizontal coordinate (from the `clientX` property of the event object) and subtract from it the coordinate of the leftmost point of the slider, which we get using the `getBoundingClientRect()` method:

```js
let left = event.clientX - this.elem.getBoundingClientRect().left; 
// event - the object of the "click" event
// this.elem - link to the slider root element
```

As a result, we will get the distance in pixels from the beginning of the slider to the click point. But we need to select the slider value from the range - `0, 1, 2, 3, 4`. Therefore, we calculate the relative value by taking the slider width as a basis: 

```js
let leftRelative = left / this.elem.offsetWidth;
```
The resulting value will be in the range from 0 to 1, because the click was inside the slider.

As you remember, we need to get a specific slider value (`0, 1, 2, 3, 4`). To do this, take the resulting value (the `leftRelative' variable) and multiply it by the number of segments:
```js
// steps - the number of steps of the slider, for our example - 5
let segments = steps - 1;
let approximateValue = leftRelative * segments;
```

As a result, most likely you will get some fractional value, for example` '1.2345`` '3.442` or similar. At the same time, it will not be less than `0` and not more than the maximum possible value of the slider, for our example it is `4`. To get a specific value that needs to be set to the slider, we round the fractional value according to the rules of mathematics:

```js
let value = Math.round(approximate Value);
```

We will use it to display it in the slider, as required above.

To get the percentage value for moving the slider and filling in the filled area, perform the inverse transformation by dividing the 'value` by the number of segments and multiplying by 100:

```js
let valuePercents = value / segments * 100;
```
