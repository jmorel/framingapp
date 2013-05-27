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
    $(document).on('click', 'div#pdflinks ul li a', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(this);
        var frameIDs = $(this).attr('frameIDs').split(',');
        var sheetSize = $(this).attr('sheetSize');
        generatePDF(sheetSize, frameIDs);
        //return false; // do not follow link
    });
}



 
function generatePDF(sheetSize, frameIDs) {

    console.log('GENERATE PDF: '+sheetSize+ " "+frameIDs.toString());
    
    // the following are the only formats supported by jspdf
    var mapping = {
        'A3': 'a3', 
        'A4': 'a4', 
        'A5': 'a5', 
        'Letter': 'letter', 
        'Legal': 'legal', 
    }

    // new pdf
    // jsPDF(orientation, unit, format)
    var pdf = new jsPDF('p', 'mm', mapping[sheetSize]);


    for(var j=0; j<frameIDs.length; j++) {
        var id = frameIDs[j];
        var frame;
        var framePos;
        for(var i=0; i<frames.length; i++) { if(frames[i].id == id) {frame = frames[i]; framePos=i;}}
        if(!frame) {return false;} // break

        // a page is automatically created when the pdf object is instanciated
        // we only have to manualy create pages for subsequent item
        if( j > 0 ) { pdf.addPage() };

        // since jsPDF cannot accomodate various orientation within the same file, we'll have to:
        // * rotate the canvas
        // * place it differently on the page
        var isLandscape = (frame.width.mm > frame.height.mm);
        
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
        if(isLandscape) {
            dest = {
                'x': frame.margin.bottom.mm,
                'y': frame.margin.left.mm,
                'width': frame.height.mm - frame.margin.top.mm - frame.margin.bottom.mm,
                'height': frame.width.mm - frame.margin.left.mm - frame.margin.right.mm
            };
        }

        // check for boundaries issues

        // worst case: the frame doesn't clip any part of the picture
        if( source.x + source.dx < 0 ||
            source.x > picture.width.mm ||
            source.y + source.dy < 0 ||
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
        source.y = source.y * heightRes;
        source.dx = source.dx * widthRes;
        source.dy = source.dy * heightRes;

        // create temporary canvas element
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = source.dx;
        tempCanvas.height = source.dy;
        var tempContext = tempCanvas.getContext('2d');

        // rotate canvas & context if necessary
        if(isLandscape) {
            tempCanvas.width = source.dy;
            tempCanvas.height = source.dx;
            tempContext.rotate(Math.PI / 2);
            tempContext.translate(0, -tempCanvas.width);
        } 

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
            // skip if this is the same frame
            if(frame.id == f.id) { continue; }

            tempContext.fillRect( // top
                (f.x.mm - frame.x.mm - frame.margin.left.mm) * widthRes, 
                (f.y.mm - frame.y.mm - frame.margin.top.mm) * heightRes,
                f.width.mm * widthRes,
                f.margin.top.mm * heightRes);
            tempContext.fillRect( // bottom
                (f.x.mm - frame.x.mm - frame.margin.left.mm) * widthRes, 
                (f.y.mm + f.height.mm - f.margin.bottom.mm - frame.y.mm - frame.margin.top.mm) * heightRes,
                f.width.mm * widthRes,
                f.margin.bottom.mm * heightRes);
            tempContext.fillRect( // left
                (f.x.mm - frame.x.mm - frame.margin.left.mm) * widthRes, 
                (f.y.mm - frame.y.mm - frame.margin.top.mm) * heightRes,
                f.margin.left.mm * widthRes,
                f.height.mm * heightRes);
            tempContext.fillRect( // right
                (f.x.mm + f.width.mm - f.margin.right.mm - frame.x.mm - frame.margin.left.mm) * widthRes, 
                (f.y.mm - frame.y.mm - frame.margin.top.mm) * heightRes,
                f.margin.right.mm * widthRes,
                f.height.mm * heightRes);
        }
        
        // load canvas into PDF
        pdf.addImage(
            tempCanvas.toDataURL('image/jpeg'),
            'JPEG',
            dest.x, dest.y,
            dest.width, dest.height);
}

    // open in new window the generated pdf
    pdf.save(sheetSize+".pdf");
}