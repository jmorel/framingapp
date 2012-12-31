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
    // hide/show function
    var hidden = !($('div#pdflinks').css('display') == 'block');
    if(hidden) {
        // populate list of pdf links
        populatePDFlinks();
        // show list of links
        $('div#pdflinks').show();
        // toggle icon in the menu to red     
        $('img#cut_button').attr('src','pix/scissors-red.png');
    }
    else {
        // hide list of links
        $('div#pdflinks').hide();
        // toggle icon in the menu to normal
        $('img#cut_button').attr('src','pix/scissors.png');
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
            panframe = panframe || f.pan(dx, dy);
        }
        if(!panframe) { picture.pan(dx, dy); }
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
