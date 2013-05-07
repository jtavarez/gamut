gamut
=====

jQuery plugin for heatmaps

This plugin lets you create a tabular heat map or other visual system based off of color ranges, by associating a range of 2 or more colors with 2 data points, and creating a spectrum for the values. So for example, you can easily add a background color to table cells based off of the values found in those cells. If you supply black and white as the colors to represent the spectrum, the lowest numbered cell will be colored black, the highest numbered cell colored white, with all other cells with corresponding shades of gray.

The plugin applies the background CSS property and assumes the number to use is in the same element to be colored, however you can override that, supply your own values, and color any element on the page, including cells, table rows, divs and inline elements.

Tested in FF, Chrome, IE8+, however if you're reading this then be warned you will probably encounter bugs. Still in progress so you must've stumbled upon this by chance. 

Examples coming eventually...

Getting Started
----

1) Download and link the latest version of the js file, along with jQuery

2) Call the gamut() function on the parent element containing all of the values. This requires 2 parameters to get started

```js
$('table').gamut({
  item : 'td',
  colorArray: ['ff0000', '000000']
});
```

See the list of parameters for all available options

Parameters
----

item

The item to be colored in. By default the data number should be in a readable format directly within this element.

dataCallback

A callback function called on each element for supplying your own value. You can drill down within each element if necessary, for example to find the value in child elements or data attributes. If no number is supplied it will look within the element

min / max

By default the code scans all elements initially to find the lowest and highest number, but you can override those values (for example, setting 0 as the minimum though the lowest value found was 50, the spectrum to be colored will act as if zero represents one end)

colorArray

An array of colors in hex format to associate with the data points, from lowest to highest. If you supply more than one  the colors will be distributed evenly across the spectrum. This parameter also accepts a number of predefined gradients (to be listed eventually), that you can also extend.

textColorArray

Same as above but will color the text instead of the background (and you can use this solely, in place of colorArray or in addition). Keep in mind if you color both the text and background it will be easy to muddle up the colors. Use with caution :)

This will be improved and formatted upon, and is also my first real contribution to github so please bear with me. But feel free to use and provide feedback if you're curious
