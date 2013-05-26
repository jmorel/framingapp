var fs = null;

function showWarning(resolution, APISupport) {
    // set up text according to actual issue
    if(resolution && APISupport) {
        $('section#warning').html('\
            <h1>Oops</h1>\
            <p>In order to take advantage of framing app, you need to have a resolution of at least 1280x768px</p>\
            <p>You also have to use a browser supporting the HTML5 FileSystem & FileWriter API.</p>\
            <p>In plain english: Google Chrome (at least version 13.0) </p>');
    } else if(resolution) {
        $('section#warning').html('\
            <h1>Oops</h1>\
            <p>In order to take advantage of framing app, you need to have a resolution of at least 1280x768px</p>');
    } else if (APISupport) {
        $('section#warning').html('\
            <h1>Oops</h1>\
            <p>In order to take advantage of framing app, you need to use a browser supporting the HTML5 FileSystem & FileWriter API.</p>\
            <p>In plain english: Google Chrome (at least version 13.0) </p>');
    }
    // display error message if there's an issue
    if(resolution || APISupport) {
        $('section#warning').show();
    }
    
}

function setupEnvironment() {
    // check resolution
    if(screen.width<1280 || screen.height < 768) {
        showWarning(true, false);
    }

    // setup file system
    try {
	   window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	   window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
       window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/,
            // callback if the new filesystem is correctly initiated
            function(newFS) {
                fs = newFS;
                setupPictureUpload(); // locate in settings.js because of asynchronous shit
                setupRestoreState();
    	   }, 
    	   // could not initiate the filesystem; no point in going further
    	   function(e) {
    	       showWarning(false, true);
    	       errorHandler(e);});
    } catch(err) {
        showWarning(false, true);
    }
    window.onresize = function() {
        resizeCanvas();
        resizeSettings();
        refresh();
    }
}


function resizeCanvas() {
    canvas.width = document.width;
    canvas.height = document.height;
}
