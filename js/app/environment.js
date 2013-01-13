var fs = null;

function showWarning() {
    $('section#warning').show();
}

function setupEnvironment() {
    // check resolution
    if(screen.width<1280 || screen.height < 768) {
        showWarning();
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
    	       showWarning();
    	       errorHandler(e);});
    } catch(err) {
        showWarning();
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
