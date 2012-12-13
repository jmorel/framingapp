function Picture(img_src, width_mm, height_mm) {
    
    // ATTRIBUTES
    this.width = {'px': 0, 'mm': 0},
    this.height = {'px': 0, 'mm': 0},
    this.x = 0;
    this.y = 0;
    this.img = new Image();
    
    // METHODS
    this.draw = function() {
        this.updatePXdim();
        context.drawImage(
            this.img, // source
            this.x, this.y, // position 
            this.width.px, this.height.px // size
        );
    }

    this.drawWithin = function(x, y, dx, dy) {
        // x, y: coordinates (within the picture) of the area to redraw
        // dx, dy: size of the area to redraw
        source = {
            'x': x * scale.px2mm / zoomLVLs[zoomSlider.value] * (this.img.width / this.width.mm),
            'y': y * scale.px2mm / zoomLVLs[zoomSlider.value] * (this.img.height / this.height.mm),
            'dx': dx * scale.px2mm / zoomLVLs[zoomSlider.value] * (this.img.width / this.width.mm),
            'dy': dy * scale.px2mm / zoomLVLs[zoomSlider.value] * (this.img.height / this.height.mm)
        };
        dest = {
            'x': this.x + x, 
            'y': this.y + y, 
            'dx': dx, 
            'dy': dy
        }

        if(source.x < 0) { 
            source.dx = source.dx + source.x; 
            source.x = 0;
            dest.dx = dest.dx + x;
            dest.x = this.x;
        }
        if(source.y < 0) { 
            source.dy = source.dy + source.y; 
            source.y = 0;
            dest.dy = dest.dy + y;
            dest.y = this.y;
        }
        if(source.x + source.dx > this.img.width) {
            source.dx = this.img.width - source.x;
            dest.dx = this.width.px - x;
        }
        if(source.y + source.dy > this.img.height) {
            source.dy = this.img.height - source.y;
            dest.dy = this.height.px - y;
        }

        context.drawImage(
            this.img,
            source.x, source.y, source.dx, source.dy,
            dest.x, dest.y, dest.dx, dest.dy);
    }

    this.printArea = function() {
        
    }
    
    this.setImgSource = function(img) {
        this.img = img;
    }
    
    this.setInitialPosition =  function() {
        this.updatePXdim();
        // Initally centered
        this.x = (scale.screen.res.width-this.width.px)/2;
        this.y = (scale.screen.res.height-this.height.px)/2;
    }
    
    this.setRealWidth = function(widthMM) {
        this.width.mm = widthMM;
    }
    this.setRealHeight = function(heightMM) {
        this.height.mm = heightMM;
    }
    
    this.updatePXdim = function() {
        this.width.px = this.width.mm * scale.mm2px * zoomLVLs[zoomSlider.value];
        this.height.px = this.height.mm * scale.mm2px * zoomLVLs[zoomSlider.value];
    }
    
};