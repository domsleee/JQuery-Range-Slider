// A class for range sliders

// Requires: jQuery

// $el should be a JQuery element

// Properties include:
// * size       : Size of the bar in em
// * ratio      : The ratio of bar/circle
// * multiple   : The multiple of the size the circle reaches when clicked
// * borderSize : The size of the border that surrounds the circle
// * percentage : Starting position
// * fgColour   : Circle and bar colour
// * bgColour   : Background colour

// Events:
// * onDown
// * onMove
// * onUp

// Library functions:
// * setPercentage(percentage)
// * disable()
// * enable()

(function() {

// Helper functions
String.prototype.toFloat = function() {
    var str = this.split(" ")[0];
    var px = Number(str.replace("px", ""));
    var em = Number(str.replace("em", ""));

    if (!isNaN(px)) return px;
    if (!isNaN(em)) return em;
    return false;
}

function RangeSlider($el, properties) {
    this.$el = $el;
    this.id = this.$el.attr("id");

    // Default properties
    this.size = 1;
    this.ratio = 0.3;
    this.multiple = 1.2;
    this.borderSize = 0.4;
    this.lastCoordinates = {x:0, y:0};
    this.percentage = 30;
    this.disabled = false;
    this.fgColour = "#04B404";
    this.bgColour = "#ddd";
    this.borderColour = "rgba(0, 0, 0, 0.2)";

    // How many times onMove is called per second
    this.pollLimit = false;
    this.lastPoll = 0;

    // Merge the properties
    for (prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            this[prop] = properties[prop];
        }
    }
    this.percentage /= 100;

    // Call the main function
    this.main();
}

RangeSlider.prototype = {
    main: function() {
        this.construct();
        this.events();

        // Update the bar percentage
        this.setBar(this.percentage);
    },
    construct: function() {
        this.$el.addClass("rangeslider");
        if (this.disabled) {
            this.$el.addClass("disabled");
        }

        // Check for ratio
        var defStyle = "background-color:"+this.fgColour+";";
        var styles = {
            rangeouter:"background-color:"+this.bgColour+";",
            rangeinner:defStyle,
            rangeselector:defStyle
        };

        var totalSize = 2*this.borderSize + this.size*this.multiple;
        this.$el.css("height", totalSize+"em");

        var height = this.size * this.ratio;
        var margin = (totalSize - height)/2;

        styles.rangeouter += "height:"+height+"em;margin:"+margin+"em 0;";
        styles.rangeinner += "height:"+height+"em;margin:"+margin+"em 0;";
        styles.rangeselector += "border-radius:" + (this.size*this.multiple) + "em;";

        // Append to the given element
        this.$el.append($("<div>", {
            class:"rangeouter",
            style:styles.rangeouter
        })).append($("<div>", {
            class:"rangeinner",
            style:styles.rangeinner
        })).append($("<div>", {
            class:"rangeselector",
            style:styles.rangeselector
        }));

        // Set the new jquery references
        this.$rangeinner = this.$el.find("div.rangeinner");
        this.$rangeouter = this.$el.find("div.rangeouter");
        this.$rangeselector = this.$el.find("div.rangeselector");

        // Set the circle to inactive
        this.setState("inactive");
    },
    events: function() {
        var _this = this;

        var onMouseDown = function(e) {
            e.preventDefault();
            if (_this.disabled || (e.button != 0 && e.type != 'touchstart')) return;

            // Set it as active
            _this.setState("active");
            var coordinates = _this.getCoordinates(e);
            var newLeft = _this.fixBar(coordinates);
            _this.lastCoordinates = coordinates;

            var percentage = _this.getPercentage(_this.lastCoordinates);
            _this.percentage = percentage;

            if (typeof(_this.onDown) === "function") {
                _this.onDown(e, percentage*100);
            }
        };

        var onMove = function(e) {
            if (e.type !== "touchmove") e.preventDefault();
            // Check if active (needed for mouse events)
            if (_this.active === true) {
                var coordinates = _this.getCoordinates(e);
                var newLeft = _this.fixBar(coordinates);
                _this.lastCoordinates = coordinates;

                if (typeof(_this.onMove) === "function") {
                    var time = window.performance.now();
                    var dTime = time - _this.lastPoll;

                    // Enforce a polling limit if it exists, otherwise
                    // let it pass all the time
                    var reqTime = (_this.pollLimit) ? 1000/_this.pollLimit : -1;

                    if (dTime > reqTime) {
                        // Call the function with appropriate datea
                        var percentage = _this.getPercentage(_this.lastCoordinates);
                        _this.percentage = percentage;
                        _this.onMove(e, percentage*100);

                        // Update the last call time
                        _this.lastPoll = time;
                    }
                }
            }
        };
        var onLeave = function(e) {
            if (_this.active === true) {
                _this.setState("inactive");
                _this.startingX = false;

                var percentage = _this.getPercentage(_this.lastCoordinates);
                _this.percentage = percentage;

                if (typeof(_this.onUp) === "function") {
                    if (typeof(_this.onMove) === "function") {
                        _this.onMove(e, percentage*100);
                    }
                    _this.onUp(e, percentage*100);
                }
            }
        };

        // Touch events
        this.$el.on("touchstart", onMouseDown);
        $(document).on("touchmove", onMove);
        $(document).on("touchend", onLeave);

        // Mouse events
        this.$el.on("mousedown", onMouseDown);
        $(document).on("mousemove", onMove);
        $(document).on("mouseup mouseleave", onLeave);
    },
    getCoordinates: function(e) {
        ret = {
            x:false,
            y:false
        };
        touches = e.originalEvent.touches || false;
        if (touches) {
            var touch = touches[0];
            ret.x = touch.pageX;
            ret.y = touch.pageY;
        } else if (e.clientX) {
            ret.x = e.clientX;
            ret.y = e.clientY;
        }

        return ret;
    },
    // Fix the selection bar depending on the coordinates
    fixBar: function(coordinates) {
        var percentage = this.getPercentage(coordinates);

        // Set the bar
        this.setBar(percentage);
    },
    getPercentage: function(coordinates) {
        // Find how far across the cursor is relative to the element
        var width = coordinates.x - this.$el[0].getBoundingClientRect().x;
        
        // Check the inner and outer bounds, and reduce if necessary
        if (width < 0) width = 0;
        if (width > this.$el.width()) width = this.$el.width();

        // Percentage
        var percentage = width / this.$el.width();

        // Return the percentage
        return percentage;
    },
    setBar: function(percentage) {
        if (percentage < 0 || percentage > 1) {
           throw new Error("RangeSlider: setBar expects a percentage between 0-1, ", percentage, "given");
        }

        // Determine how far left 
        var width = this.$el.width() * percentage;
        var left = width;

        // Apply calculated values
        this.$rangeinner.css("width", (percentage*100)+"%");
        this.$rangeselector.css("left", (percentage*100)+"%");
    },
    setState: function(state) {
        var styles = {};
        var currentLeft = this.$rangeselector.css("left").toFloat();
        if (state === "active") {
            this.active = true;

            // Set border
            styles.border = this.borderSize+"em solid "+this.borderColour;

            // Fix size
            styles.size = (this.size * this.multiple)+"em";

            // Fix top
            styles.top = 0;

        } else {
            this.active = false;

            // Set border
            styles.border = this.borderSize+"em solid rgba(0, 0, 0, 0)";

            // Fix size
            styles.size = this.size+"em";

            // Fix top alignment
            styles.top = (this.size * (this.multiple - 1) / 2) + "em";
        }

        // Fix margin
        styles.marginLeft = (-(this.borderSize + styles.size.toFloat()/2)) + "em";

        // Apply css
        this.$rangeselector.css({
            border:styles.border,
            width:styles.size,
            height:styles.size,
            top:styles.top,
            marginLeft:styles.marginLeft
        })
    },

    // Library functions
    disable: function() {
        this.$el.addClass("disabled");
        this.disabled = true;
    },
    enable: function() {
        this.$el.removeClass("disabled");
        this.disabled = false;
    },
    setPercentage: function(percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new Error("RangeSlider: setPercentage expects a percentage between 0-100, ", percentage, "given");
        }
        this.setBar(percentage/100);
    }
}
window.RangeSlider = RangeSlider;

})();