var scale = {
    'mm2px': 0, // in px per mm
    'px2mm': 0, // in mm per px
    
    'screen': {
        'res': {'width': 0, 'height':0}, // in px
        'diagonal': 0 // in inches 
    },   
};

var canvas = null;
var context = null;

var zoomSlider = null;
var oldZoomSliderValue = 20;
var zoomLVLs = new Array();

var picture = new Picture();
var lockratio = true;

var frameID = 0;
var frames = new Array();

var showTutorial = true;

// standard (ISO) paper formats used in printers
var sheet_sizes = {
    /*'4A0': { 'width': 1682, 'height': 2378},
    '2A0': { 'width': 1189, 'height': 1682},*/
    'A0': { 'width': 841, 'height': 1189},
    'A1': { 'width': 594, 'height': 841},
    'A2': { 'width': 420, 'height': 594},
    'A3': { 'width': 297, 'height': 420},
    'A4': { 'width': 210, 'height': 297},
    'A5': { 'width': 148, 'height': 210},
    'A6': { 'width': 105, 'height': 148},
    'A7': { 'width': 74, 'height': 105},
    'A8': { 'width': 52, 'height': 74}, 
    'A9': { 'width': 37, 'height': 52},
    'A10': { 'width': 26, 'height': 37},
       
    /*'2B0': { 'width': 1414, 'height': 2000},*/
    'B0': { 'width': 1000, 'height': 1414},
    'B1': { 'width': 707, 'height': 1000},
    'B2': { 'width': 500, 'height': 707},
    'B3': { 'width': 353, 'height': 500},
    'B4': { 'width': 250, 'height': 353},
    'B5': { 'width': 176, 'height': 250},
    'B6': { 'width': 125, 'height': 176},
    'B7': { 'width': 88, 'height': 125},
    'B8': { 'width': 62, 'height': 88},
    'B9': { 'width': 44, 'height': 62},
    'B10': { 'width': 31, 'height': 44},


    'C0': { 'width': 917, 'height': 1297},
    'C1': { 'width': 648, 'height': 917},
    'C2': { 'width': 458, 'height': 648},
    'C3': { 'width': 324, 'height': 458},
    'C4': { 'width': 229, 'height': 324},
    'C5': { 'width': 162, 'height': 229},
    'C6': { 'width': 114, 'height': 162},
    'C7': { 'width': 81, 'height': 114},
    'C8': { 'width': 57, 'height': 81},
    'C9': { 'width': 40, 'height': 57},
    'C10': { 'width': 28, 'height': 40},
    
    /*'D1': { 'width': 545, 'height': 779},
    'D2': { 'width': 385, 'height': 545},
    'D3': { 'width': 272, 'height': 385},
    'D4': { 'width': 192, 'height': 272},
    'D5': { 'width': 136, 'height': 192},
    'D6': { 'width': 96, 'height': 136},
    'D7': { 'width': 68, 'height': 96},

    'E3': { 'width': 400, 'height': 560},
    'E4': { 'width': 280, 'height': 400},
    'E5': { 'width': 200, 'height': 280},  
    'E6': { 'width': 140, 'height': 200},*/

    'Letter': {'width': 215.9, 'height': 279.4},
    'Legal': {'width': 215.9, 'height': 355.6} 
};

var frameFormatsID = 0;
var frameFormats = new Array();

function setupActions() {

    //printFrames(1);

    // Attaches event to the menu buttons and the various actions that can be performed within the app
    
    // eye candy for the menu
    // color change on hover for the buttons
    $('img#settings_button').hover(
        function() {$(this).attr('src','pix/settings-red.png');},
        function() {$(this).attr('src','pix/settings.png');});
    $('img#add_button').hover(
        function() {$(this).attr('src','pix/add-red.png');},
        function() {$(this).attr('src','pix/add.png');});
    $('img#delete_button').hover(
        function() {$(this).attr('src','pix/trash-red.png');},
        function() {$(this).attr('src','pix/trash.png');});
    $('img#rotate_button').hover(
        function() {$(this).attr('src','pix/rotate-red.png');},
        function() {$(this).attr('src','pix/rotate.png');});
    $('img#moveup_button').hover(
        function() {$(this).attr('src','pix/forward-red.png');},
        function() {$(this).attr('src','pix/forward.png');});
    $('img#movedown_button').hover(
        function() {$(this).attr('src','pix/backward-red.png');},
        function() {$(this).attr('src','pix/backward.png');});
    $('img#toggleseethrough_button').hover(
        function() {$(this).attr('src','pix/seethrough-off-red.png');},
        function() {$(this).attr('src','pix/seethrough-off.png');});
    $('img#cut_button').hover(
        function() {$(this).attr('src','pix/scissors-red.png');},
        function() {$(this).attr('src','pix/scissors.png');});
    $('img#closepdflinks').hover(
        function() {$(this).attr('src','pix/cross-red.png');},
        function() {$(this).attr('src','pix/cross-white.png');});
    

    // main drawing surface
	canvas = $('canvas#can')[0];
	context = $('canvas#can')[0].getContext("2d");
	
	// pan
    canvas.onmousedown = pan;
    window.onmouseup = function() { // without this you never stop dragging the img
        canvas.onmousemove = canvasHover;
    }
    
    // highlight frames under mouse
    canvas.onmousemove = canvasHover;
    
    // select
    canvas.onclick = doSelect;
	
	// zoom
    zoomSlider = $('input#zoom_lvl')[0];
    oldZoomSliderValue = zoomSlider.value;
    zoomSlider.onchange = zoomInOut;
    // attach mouse wheel to scroll level
    $('canvas#can').mousewheel(function(event, delta){
        zoomSlider.value = zoomSlider.value*1 + delta;
        zoomInOut(event, {'x': event.pageX, 'y':event.pageY});
    });
    
    // settings
    $(document).on('click', 'img#settings_button, p#editFF', function() {
        $('ul#newFrame').hide();
        $('section#menu').animate({right: '-110px'}, 'fast', function() {
            $('div#pdflinks').hide();
            $('section#settings').animate({left: '0px'}, 'slow');
        });
    })
    
    // add new frame
    $(document).on('click', 'ul#newFrame > li', function() { addNewFrame($(this).attr('id')); });
    
    // show and hide format lists
    var config = {
        over: function() {
            $("ul#newFrame").show();},
        timeout: 200,
        out: function() {
            $("ul#newFrame").mouseleave( function() {$("ul#newFrame").hide();})}
    };
    $("img#add_button").hoverIntent(config);
    
    // delete frame
    $('img#delete_button').click(deleteSelectedFrame);
    
    // rotate frame
    $('img#rotate_button').click(rotateSelectedFrame);
    
    // move frame up
    $('img#moveup_button').click(moveFrameUp);
    
    // move frame down    
    $('img#movedown_button').click(moveFrameDown);

    // toggle see through property
    $('img#toggleseethrough_button').click(toggleSeeThrough);

    // display/hide links to PDFs
    $('img#cut_button').click(function() {
        // hide/show function
        var hidden = !($('div#pdflinks').css('display') == 'block');
        if(hidden) {
            // populate list of pdf links
            populatePDFlinks();
            // show list of links
            $('div#pdflinks').show();
        }
        else {
            // hide list of links
            $('div#pdflinks').hide();
        }
    });

    $('img#closepdflinks').click(function() {
        $('div#pdflinks').hide();
    })
}