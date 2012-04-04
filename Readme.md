# Raphael Box Plot Library

This is a raphael box plot library written in CoffeeScript. Currently, all parameters are set in the library, but in the future will be usable more as a library. To use, you must update the parameters in CoffeeScript with your data and options, then recompile to javascript. Then just include Raphael & the compiled script on your page and you're good to go.

Your data must be calculated before using the code - the server should calculate the min, median, max, and 25th quartile and 75th quartile before setting on the script. The library will do the rest.

For an example, see [http://hustle.slalomchi.com/#/results/2](http://hustle.slalomchi.com/#/results/2)