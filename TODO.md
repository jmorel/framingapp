# ToDo

## PDF-generation related issues

* there's an additional y margin  
  `canvasPos.x = 0;  
   canvasPos.y = 0;  
   pdf.imagePlace(canvasPos.x, canvasPos.y);`  
  Doesn't place the image at the top left hand corner but leaves a couple of pixels of margin at the top.  
  Beware: same thing at the bottom
* LANDSCAPE mode is not working
* custom page formats in PDF
* no watermark on pdf
* changing pdf page size doesn't work

## General issues

## Additional features
* Generate basic layout with the largest frame format available    
* Save state / upload state  
* Tiling (google maps style) to allow for larger image generation