# Framing app

Framing App allows you to print large images by cutting them into small pieces printable onto standard office equipment (A5, A3 or A3 for example). 

But whereas most solution only offer a regular tiling solution, Framing App asks you to chose how you want to map your image with the paper sheets and allows you to do so freely. You then just have to assemble the pieces together.

Do not cut out the white borders though! Think of them as frames through which your picture will show itself. Set up the frame borders to be as thick or tiny as you want (check what your printer can do first) and use them to hightlight the most important parts of your picture !

# Forking and running the app

## Third part resources

Framing App uses 3 fonts, all of them available freely on Font Squirrel (see below)
* Bebas - http://www.fontsquirrel.com/fonts/Bebas
* Megalopolis Extra - http://www.fontsquirrel.com/fonts/MEgalopolis-Extra (original source: http://www.smeltery.net/fonts/megalopolis-extra)
* Nobile - http://www.fontsquirrel.com/fonts/Nobile

These fonts cannot all be redistributed freely, download them to fonts/ and adjust css/fonts.css to point to the right files to get the website working.

You may also want to update the analytics.js file to track your own website use.

## Running the app locally

You'll have to run Chrome (the HTML5 FileSystem API isn't supported yet by other browser) with the flags `--unlimited-quota-for-files` and `--allow-file-access-from-files`
