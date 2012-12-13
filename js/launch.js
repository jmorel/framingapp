function temp() {
	var w = window.open();

	page = '\
	<html>\
    <head> \
        <title> Print #FORMAT </title>\
        <style type="text/css">\
        	body { margin:0px; padding: 0px; }\
        	canvas { page-break-after:always }\
        </style>\
    </head>\
    <body onload="window.print()">';
	
    var i;
    for(i=0; i<frameID; i++) {
    	frame = frames[i];
    	if(frame.sheet == 'A4') {
    		page = page + 
    			'<canvas id="'+frame.ID+'" style="\
    				width: '+frame.width.mm+'mm; height: '+frame.height.mm+'mm; \
    				margin: '+frame.margin.top.mm+'mm '+frame.margin.right.mm+'mm '+frame.margin.bottom.mm+'mm '+frame.margin.left.mm+'mm"';
    	}
    }

	page = page + '\
    </body>\
</html>';
	w.document.write(page);

	// populate the canvas
    for(i=0; i<frameID; i++) {
    	frame = frames[i];
    	if(frame.sheet == 'A4') {
    		can = w.document.getElementById(frame.id);
    		ctx = can.getContext("2d");
    		ctx.drawImage(
            	picture.img,
            	source.x, source.y, source.dx, source.dy,
            	0, 0, can.width, can.height);
    	}
    }

	
}

$(window).load(function() {
    
	temp();

    setupEnvironment();
    setupHome();   
    setupSettingsPanel();
    setupActions();
		
});

