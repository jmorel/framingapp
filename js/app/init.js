function defineZoomMaxMin() {
    var zoomMin = 1;
    var zoomMax = 1;
    // adjust zoom levels
    var zoomMinWidth = 0.7 * document.width / (picture.width.mm * scale.mm2px);
    var zoomMinHeight = 0.7 * document.height / (picture.height.mm * scale.mm2px);
    if(zoomMinHeight < zoomMinWidth) { zoomMin = zoomMinHeight; } 
    else { zoomMin = zoomMinWidth; }
    if(zoomMin > 1) { zoomMin = 1; }

    zoomMin = Math.floor(zoomMin * 1000) / 1000;
    zoomMax = 5;

    // populate the zoomLVLs array for easy correspondance
    var i;
    zoomLVLs[0] = zoomMin;
    var step = (1-zoomMin)/20;
    for(i=1; i<20; i++) {
        zoomLVLs[i] = zoomMin + i*step;
    }
    zoomLVLs[20] = 1;
    step = (zoomMax-1)/(zoomSlider.max-20);
    for(i=21; i<zoomSlider.max; i++) {
        zoomLVLs[i] = 1 + (i-20)*step;
    }
    zoomLVLs[zoomSlider.max] = zoomMax;
    // round everything
    for(i=0;i<= zoomSlider.max; i++) {
        zoomLVLs[i] = Math.floor(zoomLVLs[i] * 1000) / 1000;
    }
}

function computeScale() {
    inch2mm = 25.4;
    scale.mm2px = 
        Math.sqrt(Math.pow(scale.screen.res.width,2) + Math.pow(scale.screen.res.height, 2)) / 
        (scale.screen.diagonal * inch2mm);
    scale.px2mm = 1 / scale.mm2px;
} 

function init() {
    // apply the new settings to the app
    
    resizeCanvas();
    computeScale();
    defineZoomMaxMin();
    picture.setInitialPosition();
    
    refresh();
}