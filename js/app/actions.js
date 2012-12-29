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
    for(var i=0; i<frames.length; i++) {
        var alreadyThere = false;
        for(var j=0; j<sheetSizesUsed.length; j++) { 
            if(frames[i].sheet == sheetSizesUsed[j]) { 
                alreadyThere = true; 
            } 
        }
        if(!alreadyThere) {
            sheetSizesUsed.push(frames[i].sheet);
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
                // todo: select pageTextSize based on the sheet size used
                pdf.pageSetSize(BytescoutPDF.A4);

                // calculate page resolution
                // this will define the how we should stretch or squeeze the image before printing.
                /* Beware this BytescoutPDF.A4 only works for 72dpi
                For custom resolution, it'd better to use:
                pdf.pageSetWidth(8.25); // 8.25 inches = 21 cm
                pdf.pageSetHeight(13.25); // 13.25 inches = 29.7 cm
                */
                var pageRes = 72 / 25.4; // this should be changed whenever possible

                // set page orientation
                pdf.pageSetOrientation(BytescoutPDF.PORTRAIT);
                if(frame.width.px > frame.height.px) { pdf.pageSetOrientation(BytescoutPDF.LANDSCAPE); }
                
                // corresponding image area
                var source = {
                    'x': frame.x.mm + frame.margin.left.mm,
                    'y': frame.y.mm + frame.margin.top.mm,
                    'dx': frame.width.mm - frame.margin.left.mm - frame.margin.right.mm,
                    'dy': frame.height.mm - frame.margin.top.mm - frame.margin.bottom.mm
                };
                // destination onto pdf 
                var dest = {
                    'x': frame.margin.left.mm,
                    'y': frame.margin.top.mm,
                    'width': frame.width.mm - frame.margin.left.mm - frame.margin.right.mm,
                    'height': frame.height.mm - frame.margin.top.mm - frame.margin.bottom.mm
                };

                // check for boundaries issues

                // worst case: the frame doesn't clip any part of the picture
                if( source.x + source.dx < 0 ||
                    source.x > picture.width.mm ||
                    source.y + source.dy <0 ||
                    source.y > picture.height.mm) {
                        // don't do anything with this frame, let's just skip it
                        continue;
                }

                // the frame is only partly over the picture
                if(source.x < 0) { 
                    source.dx = source.dx + source.x; 
                    dest.width = dest.width + source.x;
                    dest.x = dest.x - source.x;
                    source.x = 0;
                }
                if(source.y < 0) { 
                    source.dy = source.dy + source.y; 
                    dest.height = dest.height + source.y;
                    dest.y = dest.y - source.y;
                    source.y = 0;
                }
                if(source.x + source.dx > picture.width.mm) {
                    source.dx = picture.width.mm - source.x;
                    dest.width = picture.width.mm - source.x;
                }
                if(source.y + source.dy >   picture.height.mm) {
                    source.dy = picture.height.mm - source.y;
                    dest.height = picture.height.mm - source.y;
                }
                                
                // convert all to print pixels
                var widthRes = picture.img.width / picture.width.mm;
                var heightRes = picture.img.height / picture.height.mm;

                source.x = source.x * widthRes;
                source.y = source.y * widthRes;
                source.dx = source.dx * widthRes;
                source.dy = source.dy * widthRes;

                dest.x = dest.x * pageRes;
                dest.y = dest.y * pageRes;
                dest.width = dest.width * pageRes;
                dest.height = dest.height * pageRes;

                // create temporary canvas element
                var tempCanvas = document.createElement('canvas');
                tempCanvas.width = source.dx;
                tempCanvas.height = source.dy;
                var tempContext = tempCanvas.getContext('2d');

                // draw into canvas
                tempContext.drawImage(
                    picture.img,
                    source.x, source.y, source.dx, source.dy,
                    0 ,0, source.dx, source.dy);
                
                // load canvas into PDF
                pdf.imageLoadFromCanvas(tempCanvas);
                pdf.imagePlaceSetSize(
                    dest.x, dest.y, // position
                    0, // rotation
                    dest.width, dest.height);
            }
        }

        // simple CONCLUSIVE test ripped off the official website
        /*pdf = new BytescoutPDF();
        pdf.propertiesSet("Sample document title", "Sample subject", "keyword1, keyword 2, keyword3", "Document Author Name", "Document Creator Name");
        pdf.pageSetSize(BytescoutPDF.Letter);
        pdf.pageSetOrientation(true);
        pdf.pageAdd();
        pdf.fontSetName('Helvetica'); 
        pdf.fontSetStyle(false, true, true);
        pdf.textAdd(50, 50, 'hello');*/

        // open in new window the generated pdf
        var pdfBase64 = pdf.getBase64Text();
        window.open('data:application/pdf;base64,' + pdfBase64, '_blank');
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
