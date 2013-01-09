function updateFrameFormat(id) {
	var frameformat = frameFormats[id];
	
	// check values
	if( !( $('input[ffID="'+id+'"][name="name"]').val() && 
	       $('select[ffID="'+id+'"]').val() && 
	       $('input[ffID="'+id+'"][name="margintop"]').val() &&
    	   $('input[ffID="'+id+'"][name="marginbottom"]').val() &&
           $('input[ffID="'+id+'"][name="marginleft"]').val() &&
	       $('input[ffID="'+id+'"][name="marginright"]').val() )) {  
	   alert('You cannot leave this value empty.'); 
	   // revert to previous values
	   $('input[ffID="'+id+'"][name="name"]').val(frameformat.name);
	   $('select[ffID="'+id+'"]').val(frameformat.sheet);
	   $('input[ffID="'+id+'"][name="margintop"]').val(frameformat.margin.top);
	   $('input[ffID="'+id+'"][name="marginbottom"]').val(frameformat.margin.bottom);
	   $('input[ffID="'+id+'"][name="marginleft"]').val(frameformat.margin.left);
	   $('input[ffID="'+id+'"][name="marginright"]').val(frameformat.margin.right);        
	   return; 
    }
	
	// update values
	frameformat.name = $('input[ffID="'+id+'"][name="name"]').val();
	var size = $('select[ffID="'+id+'"]').val()
	frameformat.sheet = size
	frameformat.width = sheet_sizes[size].width;
	frameformat.height = sheet_sizes[size].height;
	frameformat.margin.top = $('input[ffID="'+id+'"][name="margintop"]').val();
	frameformat.margin.bottom = $('input[ffID="'+id+'"][name="marginbottom"]').val();
	frameformat.margin.left = $('input[ffID="'+id+'"][name="marginleft"]').val();
	frameformat.margin.right = $('input[ffID="'+id+'"][name="marginright"]').val();
	
	// update entries in the menu
	$('ul#newFrame').html(frameList4Menu());
	
}

function deleteFrameFormat(id) {
	// delete from the formats
	frameFormats[id] = '';
	// update settings and menu
    $('div#allFrameFormats').html(frameList4Settings());
    $('ul#newFrame').html(frameList4Menu());
}

function newFrameFormat() {
	// gather values
	var name = document.getElementById('newFF_name').value;
	var sheetsize_elt = document.getElementById('newFF_sheetsize');
	var sheetsize = sheetsize_elt.options[sheetsize_elt.selectedIndex].value;
	var margintop = document.getElementById('newFF_margintop').value;
	var marginbottom = document.getElementById('newFF_marginbottom').value;
	var marginleft = document.getElementById('newFF_marginleft').value;
	var marginright = document.getElementById('newFF_marginright').value;
	// check values
	if( !(name && sheetsize && margintop && marginbottom && marginleft && marginright)) { alert('Please input values for all 6 parameters.'); return; }
	// new FrameFormat object
	format = new FrameFormat;
	format.name = name;
	format.sheet = sheetsize;
	format.width = sheet_sizes[sheetsize].width;
	format.height = sheet_sizes[sheetsize].height;
	format.margin.top = margintop;
	format.margin.bottom = marginbottom;
	format.margin.left = marginleft;
	format.margin.right = marginright;
	// add FrameFormat to the list
	format.id = frameFormatsID;
	frameFormats.push(format);
	frameFormatsID++;
	
	// insert into the list of FrameFormats
    $('div#allFrameFormats').html(frameList4Settings());
	// insert into the app menu
	$('ul#newFrame').html(frameList4Menu());
	
	// reset form
	document.getElementById('newFF_name').value = null;
	document.getElementById('newFF_margintop').value = null;
	document.getElementById('newFF_marginbottom').value = null;
	document.getElementById('newFF_marginleft').value = null;
	document.getElementById('newFF_marginright').value = null;

    // no page reload
    return false;
}

function sheetSizesOptions(defaultOption) {
    if(!defaultOption) { defaultOption = 'A4'; }
    html = '';
    for(size in sheet_sizes) {
        if(size == defaultOption) { html = html + '<option selected="selected" value="'+size+'">'+size+'</option>' }
		else { html = html + '<option value="'+size+'">'+size+'</option>' }
    }
    return html;
}

function frameList4Menu() {
    var html = '';
    for(var i=0; i<frameFormats.length; i++) {
        format = frameFormats[i];
        if(format) { html = html + format.html4menu(); }
    }
    if(!html) { html = '<p style="font-size:smaller;">No frame format defined yet.</p>'; }
    return html;
}

function frameList4Settings() {
    var html = '';
    for(var i=0; i<frameFormats.length; i++) {
        format = frameFormats[i];
        if(format) { html = html + format.html4settings(); }
    }
    if(!html) { html = '<p class="noFFyet">None defined yet</p>'; }
    return html;
}

function setupPictureUpload() {

    // return false if the extension is not permitted
    function checkFileExtension(file) {
        var extension = file.name.split('.').pop().toLowerCase();
        if(!['gif','png','jpg','jpeg'].hasValue(extension)) {
            alert('Please choose a picture (gif, png, jpg allowed) and not just any file.');
            return false;
        }
        return true;
    }

    // performs the upload to local filesystem
    function uploadToLocalFS(file) {
        fs.root.getFile(
            file.name, 
            {create: true}, 
            function(fileEntry) {        
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {
                
                    fileWriter.onwriteend = function(e) {
                        var img = new Image();
                        img.onload = function() { 
                            // erase previous image
                            thumbnailContext.clearRect(0, 0, canvas.width, canvas.height);
                            // draw image
                            var coeff = 1;
                            if(img.width > img.height) {
                                coeff = 120 / img.width;
                                var height = img.height * coeff;
                                thumbnailContext.drawImage(img, 0, (120-height)/2, 120, height); 
                            } else {
                                coeff = 120 / img.height;
                                var width = img.width * coeff;
                                thumbnailContext.drawImage(img, (120-width)/2, 0, width, 120);
                            }
                            
                            // display general information
                            $('div#filedetails').html(file.name+'<br>'+img.width+'&times;'+img.height+'px<br>');

                        }
                        // update thumbnail
                        img.src = fileEntry.toURL();
                        
                        // for the background canvas
                        picture.setImgSource(img);
                    };
                    
                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };
                    
                    // Perform the write
                    fileWriter.write(file);
        
                }, errorHandler);
        
            }, errorHandler);               
    }
    
    // define canvas and context for future drawing
	var thumbnailContext = $('canvas#thumbnail')[0].getContext("2d"); 	
    
    // activate file upload with classical click and select method
    // make sure the click on the decoy triggers the input field
    $('canvas#thumbnail, div#thumbnailcaption').click(function() {
        $('input#pictureinput').click();
    });
    // upon the selection of a new file
    $('input#pictureinput').change(function() {
        // get the file
		var files = this.files;
		var file = null;
		for(var i=0; i<files.length; i++) { file = files[i]; }
		if(!file) { return; }
		// check that the file is an image
	    if(!checkFileExtension(file)) { return; }
		// perform the upload
        uploadToLocalFS(file);
    });

    // activate file upload for drag and drop
	// enable drag and drop on the decoy
    function ignoreDrag(e) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
    }
    function drop(e) {
        ignoreDrag(e);
        var data = e.originalEvent.dataTransfer;
        // get the file
        var files = data.files;
        var file = null;
        for(var i=0; i<files.length; i++) { file = files[i]; }
        if(!file) { return; }
        // check that the file is an image
        if(!checkFileExtension(file)) { return; }
        // perform the upload
        uploadToLocalFS(file);
    }
    $('canvas#thumbnail, div#thumbnailcaption').bind('dragenter', ignoreDrag).bind('dragover', ignoreDrag).bind('drop', drop);
}

function resizeSettings() {
    $('div#allFrameFormats').height($('body').height() - 270 + 'px');
}

function setupSettingsPanel() {

    resizeSettings();

    // save state / upload state
    //$('img#uploadstate').click(uploadState);
    $('img#downloadstate').click(downloadState);

	// Populate paper sizes list in the "new frame format form"
    $('select#newFF_sheetsize').html(sheetSizesOptions());

	// Click on the "+" button actually creates the new frame format
	$('div#addArrow').click(newFrameFormat);
	$('form').submit(newFrameFormat);

    // Change color of the cross
    $('img#delFF')
        .live('mouseenter', function() {$(this).attr('src','pix/cross-red.png');})
        .live('mouseleave', function() {$(this).attr('src','pix/cross.png');});

	// Click on the delete button deletes the frameFormat
	$('img#delFF').live('click', function() {
        deleteFrameFormat($(this).attr('ffID'));
    });
    
    // Modifying any field of an already existing frameFormat updates it
    $('div#allFrameFormats input, div#allFrameFormats select').live('change', function() { 
        updateFrameFormat($(this).attr('ffID')); 
    })

    // default values
	$('input#screenwidth').val(screen.width);
	$('input#screenheight').val(screen.height);
	scale.screen.res.width = screen.width;
	scale.screen.res.height = screen.height;

    // Changes in real life size
    $('input#widthMM').change(function() {
        picture.setRealWidth($(this).val());
    });
    $('input#heightMM').change(function() {
        picture.setRealHeight($(this).val());
    });
    
    // Changes in screen resolution
    $('input#screenwidth').change(function() {
        scale.screen.res.width = $(this).val();
    });
    $('input#screenheight').change(function() {
        scale.screen.res.height = $(this).val();        
    });
    
    // Changes in screen diagonal
    $('input#screendiagonal').change(function() {
        scale.screen.diagonal = $(this).val();        
    });
    
    $('div#go').click(function() {
        
        // FOR TESTING PURPOSES ONLY
        setupTestCut();

        // check that all settings are ok
        
        // do we have a picture ?
        if(!picture.img.src) {alert('You have to select a picture.'); return;}
        // do we have a size in mm ?
        else if(!(picture.width.mm && picture.height.mm)) { alert('You need to input the actual dimensions of your picture.'); return;}
        // do we have a screen resolution ?
        else if(!(scale.screen.res.width && scale.screen.res.height)) {
        alert(scale.screen.res.width+'x'+scale.screen.res.height)
        alert('You need to input your screen resolution.'); return;}
        // do we have a screen diagonal ?
        else if(!scale.screen.diagonal) {alert('You need to input your screen diagonal.'); return;}
        
        // move the whole settings section out of the screen
        // refresh the screen
        $('section#settings').animate({left: '-980px'}, 'slow', function() {
            $('section#menu').animate({right: '0px'}, 'fast');
            init();
        });
        
    });
}

function setupStateUpload() {

    // return false if the extension is not permitted
    function checkFileExtension(file) {
        var extension = file.name.split('.').pop().toLowerCase();
        if(!['txt'].hasValue(extension)) {
            alert('Please chose a text file.');
            return false;
        }
        return true;
    }
    
    // activate file upload with classical click and select method
    // make sure the click on the decoy triggers the input field
    $('img#uploadstate').click(function() {
        $('input#stateinput').click();
    });

    // upon the selection of a new file
    $('input#stateinput').change(function() {
        // get the file
        var files = this.files;
        var file = null;
        for(var i=0; i<files.length; i++) { file = files[i]; }
        if(!file) { return; }
        // check that the file is an image
        if(!checkFileExtension(file)) { return; }
        // perform the upload
        var reader =  new FileReader();
        reader.onload = function() {
            // convert data to JSON
            var state = eval('(' + reader.result + ')');
            updateAppState(state);
        }
        var content = reader.readAsText(file);
        $(this).val('');
    });
}