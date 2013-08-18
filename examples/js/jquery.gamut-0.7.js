/*!
 * jQuery Gamut Plugin
 * http://jasontavarez.com
 * Copyright (c) 2013 Jason Tavarez
 * Version 0.8 (May 2013)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.8 or later
 */
 ;(function($) {
"use strict";


$.fn.gamut = function(options) {

  // Merge user-supplied parameters with default
  var options = $.extend({}, $.fn.gamut.defaults, options);

  return this.each(function() {
    
    // Set group of elements we will be working with
    var $this = $(this);
    var elements = $this.find(options.item);

    // First value to use for min/max checking. Can't assume 0 for min since that
    // might  not be in range of values
    var initialNum = getData($(elements[0]));

    var maxNum, minNum;
    options.max ? maxNum = options.max : maxNum = initialNum;
    options.min ? minNum = options.min : minNum = initialNum;

    var colorArray, colorLength;
    var rgbArray = [];
    var rgbTextArray = [];

    var textColorArray, textColorLength;
    var dataArray = [];

    // To make this more awesome, we have the choice of predefined gradients
    // (with ability to add more choices by extending function), or directly
    // adding an array of hex codes, right in same parameter. This checks for
    // predefined names first, if NULL then checks for directly inputted array.
    // Validation will be the same in either case.
    if (options.colorArray){
      if ($.fn.gamut.gradients[options.colorArray])
      {
        // Cache the length of array
        colorArray = $.fn.gamut.gradients[options.colorArray];
        colorLength = $.fn.gamut.gradients[options.colorArray].length;
      } else {
        colorArray = options.colorArray;
        colorLength = options.colorArray.length;
      }

      // First we ensure there's at least 2 colors, otherwise it's not a gradient
      if ( colorLength > 1 )
      {
        // Then we use some functions to retrieve R, G, and B values for hex code
        // and store in an object. If that element is NULL then we know that provided
        // hex code wasn't valid
        for ( var i=0; i<colorLength; i++ )
        {
          rgbArray.push( hexToRgb(colorArray[i]) );
        }
      }
    }


    // Same as above for TEXT color array which could be different
    if (options.textColorArray){
      if ($.fn.gamut.gradients[options.textColorArray])
      {
        // Cache the length of array
        textColorArray = $.fn.gamut.gradients[options.textColorArray];
        textColorLength = $.fn.gamut.gradients[options.textColorArray].length;
      } else {
        textColorArray = options.textColorArray;
        textColorLength = options.textColorArray.length;
      }
      // First we ensure there's at least 2 colors, otherwise it's not a gradient
      if ( textColorLength > 1 )
      {
        for ( var i=0; i<textColorLength; i++ )
        {
          rgbTextArray.push( hexToRgb(textColorArray[i]) );
        }
      }
    }

    // Go through loop initially to find min and max values
    // (then adjust for possible user-supplied choice)
    // ---------------------------------------
    elements = elements.filter(function(i)
    {
      var elem = $(this);
      var num = getData(elem);

      if (isNaN(num)) {
        return 0;
      } else {
        if ( num < minNum )
        {
          minNum = num;
        } else if ( num>maxNum )
        {
          maxNum = num;
        }
        dataArray.push( num )
        return 1;
      }
    });

    // Plugin will break if numbers are equal or inverted,
    // this rectifies that
    if (minNum >= maxNum) { maxNum = minNum + 1; }

    // Go through elements 2nd time for actual coloring
    // Hide element to minimize redraw
    // ----------------------------------------------
    $this.css('display', 'none');
    elements.each(function(i)
    {
      var elem = $(this);
      var num = dataArray[i];

      if (options.colorArray){
      var color = calculateHexColor(getRelVal(num), rgbArray);
      elem.css('background-color', '#'+color);
      }
      if (options.textColorArray){
      var color = calculateHexColor(getRelVal(num), rgbTextArray);
      elem.css('color', '#'+color);
      }
      
    });
    $this.css('display', '');

    function getRelVal(num){
      return ((num-minNum)/(maxNum-minNum));
    }

    function hex(n) {
        // Remove hash tag from user supplied color code, if there's one
        return n.replace(/^#/,"");
    }

    // This converts HEX to RGB
    function hexToRgb(hex)
    {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
      } : null;
    }
    
    // and back to hex
    function componentToHex(c)
    {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    // This is where the color for the bar (for GRADIENTS) is actually
    // calculated, based on percentage of bar plus array of colors
    function calculateHexColor(percentage, colorArray)
    {
      if (percentage > 1)
        percentage = 1;
      else if (percentage < 0)
        percentage = 0;

      percentage *= 100;

      // Find out the increment between number of elements
      // (i.e. array of 5 colors would mean 4 steps in between, each 25%
      //  from 0 to 100)
      var step = 100 / (colorArray.length - 1);

      // This lets us know in between which 2 colors our percentage
      // would fall under. In the case that percentage = 100 there is
      // no succeeding color after that so we set that to last step still
      var color_1_index = parseInt(percentage/step);
      if (color_1_index == colorArray.length - 1 )
        color_1_index=color_1_index-1;
      var color_2_index = color_1_index + 1;

      // Get the numeric range of the increment (might be same as step, CHECK)
      var range = (color_2_index*step)-(color_1_index*step);

      var r,g,b;
  
      // Where magic happens. Calculates percentage between 2 colors given 2 data points
      r = Math.abs(parseInt(((colorArray[color_1_index].r - colorArray[color_2_index].r) * ((percentage-(color_1_index*step))/range))-colorArray[color_1_index].r));
      g = Math.abs(parseInt(((colorArray[color_1_index].g - colorArray[color_2_index].g) * ((percentage-(color_1_index*step))/range))-colorArray[color_1_index].g));
      b = Math.abs(parseInt(((colorArray[color_1_index].b - colorArray[color_2_index].b) * ((percentage-(color_1_index*step))/range))-colorArray[color_1_index].b));

      return componentToHex(r) + componentToHex(g) + componentToHex(b);      
    }

  });

  function convertNumber(string)
  {
    string = string.toString();
    return parseFloat(string.replace(/[^\d.-]/g, ""));
  }

  function getData(element)
  {
    var num = options.dataCallback.call(this, element); 
    if (num === undefined){
      num = convertNumber(element.html());
    } else {
      num = convertNumber(num);
    }
    return num;
  }
};

$.fn.gamut.gradients = {
  red: ['#000000', 'fff000', '#ff0000'],
  ice: ['000000', '0059c7', '5ca9eb']
};

$.fn.gamut.defaults = {
  item:          '> *',
  dataCallback:          function(element){},
  min:           null,
  max:           null,
  textColorArray: null,
  colorArray: null,
};

})(jQuery);