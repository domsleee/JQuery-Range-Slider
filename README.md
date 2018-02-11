# Range Slider

A JS & JQuery implementation of a range slider, inspired by Android's range sliders.

### <a href="https://domsleee.github.io/JQuery-Range-Slider/">======= Live Demo =======</a>

<a href="https://domsleee.github.io/JQuery-Range-Slider/"><img width=235 src="https://puu.sh/qYqsv/1d283527a6.png"></a>

<a href="https://domsleee.github.io/JQuery-Range-Slider/"><img width=235 src="https://puu.sh/qYqou/ea4abe298c.png"></a>


## Getting Started

Include JQuery and [relevant files](https://github.com/domsleee/JQuery-Range-Slider/tree/master/dist) in your html `<head>` tag:

~~~html
<!-- Rangeslider files -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="rangeslider/rangeslider.min.css">
<script src="rangeslider/rangeslider.min.js"></script>
~~~~

Make an appropriately sized `div` for the rangeslider within your html `<body>`:

~~~html
<div id="slider_1" style="width:200px;"></div>
~~~

Apply RangeSlider to a JQuery object within a script:

~~~JavaScript
var slider = new RangeSlider($("#slider_1"), {
  // Colours
  fgColour: "#04b404", // Foreground colour
  bgColour: "#ddd"   , // Background colour
  
  // Starting position
  percentage: 20,
	
  // Events - will run on touch & mouse triggers
  onDown: function(e, percentage) {
    console.log("Clicked at", percentage + "%");
  },
  onMove: function(e, percentage) {
    console.log("Moved to", percentage + "%");
  },
  onUp: function(e, percentage) {
    console.log("Slider control ended");
  }
});
~~~

## Library functions

The following functions can be called on the RangeSlider object after it has been initialised:

~~~JavaScript
// Disable the range slider
// This will disable slider movement and events
slider.disable();

// Enable the range slider
slider.enable();

// Change the position of the slider to 30%
slider.setPercentage(30);
~~~

## Development

Install all `npm` modules:

~~~bash
npm install .
~~~

This project uses grunt to minify the javascript and css files from `src/` and move them into `dist/rangeslider/`.

To build:

~~~bash
grunt
~~~

To build every time a script or stylesheet is changed:

~~~bash
grunt watch
~~~