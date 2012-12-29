# ToDo

* there's an additional y margin  
  `canvasPos.x = 0;  
   canvasPos.y = 0;  
   pdf.imagePlace(canvasPos.x, canvasPos.y);`  
  Doesn't place the image at the top left hand corner but leaves a couple of pixels of margin at the top.  
  Beware: same thing at the bottom
* Try the pdf generation without managing by hand the stretching of the image.