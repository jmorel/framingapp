function updateAppState(state) {

    // update picture properties
    $('input#widthMM').val(state.picture.width.mm).change();
    $('input#heightMM').val(state.picture.height.mm).change();

    // update frame formats
    frameFormats = new Array();
    for(var i=0; i<state.frameFormats.length; i++) {
        data = state.frameFormats[i];
        ff = new FrameFormat;
        ff.name = data.name;
        ff.sheet = data.sheet;
        ff.width = data.width;
        ff.height = data.height;
        ff.margin = data.margin;
        ff.id = data.id;
        frameFormats.push(ff);
    }
    frameFormatsID = state.frameFormatsID;
    // insert into the list of FrameFormats
    $('div#allFrameFormats').html(frameList4Settings());
    // insert into the app menu
    $('ul#newFrame').html(frameList4Menu());

    // update frames
    frames = new Array();
    for(var i=0; i<state.frames.length; i++) {
        data = state.frames[i];
        f = new Frame;
        f.id = data.id;
        f.sheet = data.sheet;
        f.width.mm = data.width;
        f.height.mm = data.height;
        f.margin.top.mm = data.margin.top;
        f.margin.bottom.mm = data.margin.bottom;
        f.margin.left.mm = data.margin.left;
        f.margin.right.mm = data.margin.right;
        f.x.mm = data.x;
        f.y.mm = data.y;
        f.seethrough = data.seethrough;
        f.updatePXpos();
        f.updatePXdim();
        frames.push(f);
    }
    frameID = data.frameID;

    refresh();
}

function downloadState() {
    // collect data

    var picturedata = {
        'width': {
            'px': picture.width.px,
            'mm': picture.width.mm},
        'height': {
            'px': picture.height.px,
            'mm': picture.height.mm},
    };

    var dataframeformats = [];
    for(var i=0; i<frameFormats.length; i++) {
        var ff = frameFormats[i];
        dataframeformats.push({
            'name': ff.name,
            'sheet': ff.sheet,
            'width': ff.width,
            'height': ff.height,
            'margin': {
                'top': ff.margin.top, 
                'bottom': ff.margin.bottom, 
                'left': ff.margin.left, 
                'right': ff.margin.right},
            'id': ff.id
        });
    }

    var dataframes = [];
    for(var i=0; i<frames.length; i++) {
        var f = frames[i];
        dataframes.push({
            'id': f.id,
            'sheet': f.sheet,
            'width': f.width.mm,
            'height': f.height.mm,
            'margin': {
                'top': f.margin.top.mm,
                'bottom': f.margin.bottom.mm,
                'left': f.margin.left.mm,
                'right': f.margin.right.mm },
            'x': f.x.mm,
            'y': f.y.mm,
            'seethrough': f.seethrough
        });
    }

    var state = {
        'picture': picturedata,
        'frameFormatsID': frameFormatsID,
        'frameFormats': dataframeformats,
        'frameID': frameID,
        'frames': dataframes
    }
    
    // build text file and offer to download
    var bb = new BlobBuilder;
    bb.append(JSON.stringify(state));
    saveAs(bb.getBlob("text/plain;charset=utf-8"), "framingappstate");
}

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
    center = center || {'x': document.width/2, 'y':document.height/2};
    var h = zoomLVLs[zoomSlider.value] / zoomLVLs[oldZoomSliderValue];
    oldZoomSliderValue = zoomSlider.value;
    picture.x = h*(picture.x-center.x) + center.x;
    picture.y = h*(picture.y-center.y) + center.y;
    refresh(); 
}
