function populatePDFlinks() {
    // retrieve list of used sheet sizes
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
    // retrieve frames ID that will be included in each single 10-page pdfs.
    // the structure of pdflinks will be of the kind
    // pdflinks = {'A4': [ [1,2,3,4,5,6,7,8,9,10], [11, 12, 13]}
    var pdflinks = {};
    for(var i=0; i<sheetSizesUsed.length; i++) {
        var sheetSize = sheetSizesUsed[i];
        pdflinks[sheetSize] = new Array();
        var c = 0;
        var pdfIDs = new Array();
        for(var j=0; j<frames.length; j++) {
            var frame = frames[j];
            if(frame.sheet == sheetSize) { 
                pdfIDs.push(frame.id); 
                c = c+1;
                if(c == MAX_PAGES_PER_PDF) { 
                    pdflinks[sheetSize].push(pdfIDs);
                    pdfIDs = new Array();
                    c = 0;
                }
            }
        }
        if(c != 0) {pdflinks[sheetSize].push(pdfIDs);}
    }
    
    // generate the pdf links from this data
    var html = '';
    for(var i=0; i<sheetSizesUsed.length; i++) {
        var sheetSize = sheetSizesUsed[i];
        if(pdflinks[sheetSize].length == 0) {continue;} // this should not be necessary !
        html = html + '<li><span class="sheetSize">' + sheetSize + '</span>';
        for(var j=0; j<pdflinks[sheetSize].length; j++) {
            html = html + '<a href="" frameids="'+ pdflinks[sheetSize][j] + '" sheetSize="' + sheetSize +'">#' + (j+1) + '</a> ';
        }
        html = html + '</li>';
    }
    if(html == '') { html = '<p>nothing yet</p>'; }
    $('div#pdflinks ul').html(html);

    // connect the newly created links to the pdf generation
    $('div#pdflinks ul li a').live('click', function() {
        var frameIDs = $(this).attr('frameIDs').split(',');
        var sheetSize = $(this).attr('sheetSize');
        generatePDF(sheetSize, frameIDs);
        return false; // do not follow link
    });
}



 
function generatePDF(sheetSize, frameIDs) {
    
    // new pdf
    var pdf = new BytescoutPDF();

    // set page size for this pdf
    var mapping = {
        'A0': BytescoutPDF.A0, 
        'A1': BytescoutPDF.A1, 
        'A2': BytescoutPDF.A2,
        'A3': BytescoutPDF.A3, 
        'A4': BytescoutPDF.A4, 
        'A5': BytescoutPDF.A5, 
        'A6': BytescoutPDF.A6, 
        'A7': BytescoutPDF.A7, 
        'Letter': BytescoutPDF.Letter, 
        'Legal': BytescoutPDF.Legal, 
        'Executive': BytescoutPDF.Executive, 
        'JisB5': BytescoutPDF.JisB5
    }
    pdf.pageSetSize(mapping[sheetSize]);
    // set page orientation
    pdf.pageSetOrientation(BytescoutPDF.PORTRAIT);

    for(var j=0; j<frameIDs.length; j++) {
        var id = frameIDs[j];
        var frame;
        var framePos;
        for(var i=0; i<frames.length; i++) { if(frames[i].id == id) {frame = frames[i]; framePos=i;}}
        if(!frame) {return false;} // break

        pdf.pageAdd();

        // calculate page resolution
        // this will define the how we should stretch or squeeze the image before printing.
        /* Beware this BytescoutPDF.A4 only works for 72dpi
        For custom resolution, it'd better to use:
        pdf.pageSetWidth(8.25); // 8.25 inches = 21 cm
        pdf.pageSetHeight(13.25); // 13.25 inches = 29.7 cm
        */
        var pageRes = 72 / 25.4; // this should be changed whenever possible

        
        
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
        
        // do the rotation now that we are still working in mm
        var isLandscape = (frame.width.mm > frame.height.mm);
        var angle = 0;
        if(isLandscape) {
            angle = -90;
            xtemp = dest.x;
            dest.x = frame.height.mm - dest.y - dest.height;
            dest.y = xtemp - dest.height;
        }

        // convert all to print pixels
        var widthRes = picture.img.width / picture.width.mm;
        var heightRes = picture.img.height / picture.height.mm;

        source.x = source.x * widthRes;
        source.y = source.y * heightRes;
        source.dx = source.dx * widthRes;
        source.dy = source.dy * heightRes;

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

        // also draw borders from other frames within this canvas
        tempContext.fillStyle = '#FFF';
        for(var i=0; i<frames.length; i++) {
            f = frames[i];
            // skip if the main frame is seethrough and the temp frame is under it.
            if(frame.seethrough && framePos>i) { continue; }
            tempContext.fillRect( // top
                (f.x.mm - frame.x.mm) * widthRes, 
                (f.y.mm - frame.y.mm) * heightRes,
                f.width.mm * widthRes,
                f.margin.top.mm * heightRes);
            tempContext.fillRect( // bottom
                (f.x.mm - frame.x.mm) * widthRes, 
                (f.y.mm + f.height.mm - f.margin.bottom.mm - frame.y.mm) * heightRes,
                f.width.mm * widthRes,
                f.margin.bottom.mm * heightRes);
            tempContext.fillRect( // left
                (f.x.mm - frame.x.mm) * widthRes, 
                (f.y.mm - frame.y.mm) * heightRes,
                f.margin.left.mm * widthRes,
                f.height.mm * heightRes);
            tempContext.fillRect( // right
                (f.x.mm + f.width.mm - f.margin.right.mm - frame.x.mm) * widthRes, 
                (f.y.mm - frame.y.mm) * heightRes,
                f.margin.right.mm * widthRes,
                f.height.mm * heightRes);
        }
        
        // load canvas into PDF
        pdf.imageLoadFromCanvas(tempCanvas);
        // we have to be attentive of whether this is a portrait (standard) or landscape frame
        /*if(frame.width.px > frame.height.px) { pdf.pageSetOrientation(BytescoutPDF.LANDSCAPE); console.log('landscape');}*/
        
        pdf.imagePlaceSetSize(
            dest.x, dest.y, // position
            angle, // rotation
            dest.width, dest.height);
}

    // open in new window the generated pdf
    var pdfBase64 = pdf.getBase64Text();
    window.open('data:application/pdf;base64,' + pdfBase64, '_blank');
}