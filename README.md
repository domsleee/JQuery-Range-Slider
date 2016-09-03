# Range Slider

A JS & JQuery implementation of a range slider, inspired by Android's range sliders.

<a href="https://domsleee.github.io/JQuery-Range-Slider/"><img width=235 src="https://puu.sh/qYqsv/1d283527a6.png"></a>

<a href="https://domsleee.github.io/JQuery-Range-Slider/"><img width=235 src="https://puu.sh/qYqou/ea4abe298c.png"></a>
## Sample Usage

Download the relevant files and include them:

~~~html
<!-- Rangeslider files -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="rangeslider/rangeslider.min.css">
<script src="rangeslider/rangeslider.min.js"></script>
~~~~

Apply RangeSlider to a JQuery object:

~~~JavaScript
var slider = new RangeSlider($("#el"), {
  // Colours
  fgColour: #04b404, // Foreground colour
  bgColour: #ddd   , // Background colour
  
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

Library functions:
~~~JavaScript
// Disable the range slider
// This will disable slider movement and events
slider.disable();

// Enable the range slider
slider.enable();

// Change the position of the slider to 30%
slider.setPercentage(30);
~~~
