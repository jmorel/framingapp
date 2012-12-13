function addNewFrame(formatID) {
    // Create an associated Frame
    frame = new Frame(frameID, frameFormats[formatID]);
    // Select the newly created frame and deselect previous one
    for(var j=0; j<frames.length;j++) { frames[j].selected = false;}
    frame.selected = true;
    // Add this frame to the list
    frames.push(frame);
    frameID++;
    // Refresh canvas
    refresh();
}

function cut() {

    /*alert('We should be cutting the image here!');*/

    // we will generate one pdf per paper format (margins are irrelevant)


    // checking paper sizes used
    // result contained in sheetSizesUsed
    var sheetSizesUsed = Array();
    for(var=0; i<frameFormats.length; i++) {
        var alreadyThere = false;
        for(var j=0; j<sheetSizesUsed.length; j++) { 
            if(frameFormats[i] == sheetSizesUsed[j]) { 
                alreadyThere = true; 
            } 
        }
        if(!alreadyThere) {
            sheetSizesUsed.push(frameFormats[i].sheet);
        }
    }

    // for each paper format
    for(var i=0; i<sheetSizesUsed.length; i++) {
        var sheetSize = sheetSizesUsed[i];

        // new pdf
        var pdf = new BytescoutPDF();

        for(var j=0; j<frames.length; j++) {
            if(frames[j].sheet == sheetSize) {
                var frame = frames[j];
                pdf.pageAdd();
                pdf.pageTextSize(BytescoutPDF.A4);
                /* Beware this BytescoutPDF.A4 only works for 72dpi
                For custom resolution, it'd better to use:
                pdf.pageSetWidth(8.25); // 8.25 inches = 21 cm
                pdf.pageSetHeight(13.25); // 13.25 inches = 29.7 cm
                */

                /*pdf.pageSetOrientation(BytescoutPDF.PORTRAIT); //BytescoutPDF.LANDSCAPE*/

                pdf.imageLoadFromCanvas(canvas); // warning, this ought to be a specific canvas, not our big one
                pdf.imagePlace(20, 40); //
            }
        }

        //return pdf;
    }
    
}

function canvasHover(e) {
    var refreshDisplay = false;
    for(var i=frames.length-1; i>=0; i--) {
        f = frames[i];
        if(f.over(e.clientX, e.clientY)) {
            if(!f.highlight) {
                f.highlight = true;
                document.body.style.cursor = 'pointer';
                refreshDisplay = true;
            }
            break;
        } else {
            if(f.highlight) {
                f.highlight = false;
                document.body.style.cursor = 'default';
                refreshDisplay = true;
            }
        }
    }
    if(refreshDisplay) { refresh(); }
}

function deleteSelectedFrame() {
    var i = 0;
    var doDelete = false;
    for(i=0; i<frames.length; i++) {
        if(frames[i].selected) { 
            doDelete = true;
            break; 
        }
    }
    if(doDelete) {
        var framesbis = Array();
        for(var j=0; j<frames.length; j++) {
            if(j != i) { framesbis.push(frames[j]); }
        }
        frames = framesbis;
        refresh();
    }
}

function selectFrame(id) {
    f = frames[id];
    // unselect all
    for(var j=0; j<frames.length;j++) { frames[j].selected = false;}
    // select this one            
    f.selected = true;
}

function doSelect(e) {
    for(var id=frames.length-1; id>=0; id--) {
        f = frames[id];
        if(f.over(e.clientX, e.clientY)) {
            selectFrame(id);
            refresh();
            break;
        } 
    }
}

function moveFrameUp() {
    var i = 0;
    var doMove = false;
    for(i=0; i<frames.length; i++) {
        if(frames[i].selected) { 
            doMove = true;
            break; 
        }
    }
    if(doMove) {
        var framesbis = Array();
        for(var j=0; j<frames.length; j++) {
            if((j == i) && (i<frames.length-1)) { 
                framesbis.push(frames[i+1]); 
                framesbis.push(frames[i]);
                j++;
            } else {
                framesbis.push(frames[j]);
            }
        }
        frames = framesbis;
        refresh();
    }
}

function moveFrameDown() {
    var i = 0;
    var doMove = false;
    for(i=0; i<frames.length; i++) {
        if(frames[i].selected) { 
            doMove = true;
            break; 
        }
    }
    if(doMove) {
        var framesbis = Array();
        for(var j=0; j<frames.length; j++) {
            if(j == i-1) { 
                framesbis.push(frames[i]); 
                framesbis.push(frames[j]);
                j++;
            } else {
                framesbis.push(frames[j]);
            }
        }
        frames = framesbis;
        refresh();
    }
}

function pan(e) {
    // pan only
    var oldMouseX = e.clientX;
    var oldMouseY = e.clientY;
    canvas.onmousemove = function(e) {
        // for the movement
        var mouseX = e.clientX
        var mouseY = e.clientY
        var dx = mouseX - oldMouseX;
        var dy = mouseY - oldMouseY;
        oldMouseX = mouseX;
        oldMouseY = mouseY;
        // decide what to pan
        var i;
        var panframe = false;
        for(var id=frames.length-1; id>=0; id--) {
            f = frames[id];
            if(f.highlight) {
                panframe = true;
                break;
            }
        }
        // perform pan
        if(panframe) {
            selectFrame(id);
            f = frames[id];
            f.x.px += dx;
            f.y.px += dy;
            f.updateMMpos();
        } else {
            // pan whole image
            picture.x += dx;
            picture.y += dy;
        }
        refresh();
    }
}

function refresh() {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // update drawing
    picture.draw();
    
    // update frames
    for(var i=0; i<frames.length; i++) {
        f = frames[i];
        f.draw();
    }
}

function rotateSelectedFrame() {
    for(var i=0; i<frames.length; i++) {
        f = frames[i];
        if(f.selected) {
            f.rotate();
            refresh();
            break;
        }
    }
}

function toggleSeeThrough() {
    for(var i=0; i<frames.length; i++) {
        f = frames[i];
        if(f.selected) {
            f.toggleSeeThrough();
            refresh();
            break;
        }
    }
}

function zoomInOut(evt, center) {
    console.log("before ", center);
    center = center || {'x': document.width/2, 'y':document.height/2};
    console.log("after ", center);
    var h = zoomLVLs[zoomSlider.value] / zoomLVLs[oldZoomSliderValue];
    oldZoomSliderValue = zoomSlider.value;
    picture.x = h*(picture.x-center.x) + center.x;
    picture.y = h*(picture.y-center.y) + center.y;
    refresh(); 
}
