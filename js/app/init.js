/**
 * Define maximum and minimum values for zoom and set up the zoom accordingly.
 * 
 * Zooming works as follow: 
 * 1. The displayed width of the picture (in px) is picture.width.px
 * 2. We use the print resolution (dpmm) even for display purposes,
 *    ie. 100% zoom level means picture.width.px = picture.width.mm * dpmm
 * 3. picture.width.px = picture.width.mm * zoomLVL 
 *    where zoomLVL = zoom.valueAsNumber
 * 
 * The max and min zoom values are such as:
 * * When fully zoomed out, the picture fills 70% of the screen width/height
 * * When fully zoomed in, the picture fills 1000% (10 times more) of its natural size
 */
function defineZoomMaxMin() {
    var zoomMin,
        zoomMinHeight,
        zoomMinWidth,
        zoomMax;

    // 70 percent fill:
    // picture.width.mm * minZoom = 0.7 * document.width
    zoomMinWidth = 0.7 * document.width / picture.width.mm;
    zoomMinHeight = 0.7 * document.height / picture.height.mm;
    zoomMin = zoomMinWidth;
    if ( zoomMinHeight < zoomMinWidth ) { zoomMin = zoomMinHeight; } 
    
    // 1000% zoom
    // picture.width.px = 10 * ( picture.width.mm * dpmm)
    zoomMax = 10 * dpmm;

    // setup zoom
    var stepNb = parseInt( zoom.dataset.stepNumber ) + 1,
        step = (zoomMax - zoomMin) / stepNb;
        
    zoom.min = zoomMin;
    zoom.max = zoomMax;
    zoom.step = step;
    zoom.value = zoomMin;
    zoom.dataset.previousValue = zoomMin;
}

/**
 * Compute image print resolution based on user specifications
 */
function computeDPMM() {
    dpmm = picture.img.width / picture.width.mm;
} 


function init() {
    // apply the new settings to the app
    
    resizeCanvas();
    computeDPMM();
    defineZoomMaxMin();
    picture.setInitialPosition();
    
    refresh();
}