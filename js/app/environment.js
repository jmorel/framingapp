var fs = null;

function setupEnvironment() {
    // setup file system
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, 
	   // callback if the new filesystem is correctly initiated
	   function(newFS) {
            fs = newFS;
            setupPictureUpload(); // locate in settings.js because of asynchronous shit
            setupStateUpload();
	   }, 
	   // could not initiate the filesystem; no point in going further
	   function(e) {
	       alert('You need to use Google Chrome at least 12 to use this application');
	       errorHandler(e);});
     
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
