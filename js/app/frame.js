function Frame(id, format) {

    // METHODS
    
    this.updatePXpos = function() {
        this.x.px = this.x.mm * zoomLVLs[zoomSlider.value];
        this.y.px = this.y.mm * zoomLVLs[zoomSlider.value];
    }
    
    this.updateMMpos = function() {
        this.x.mm = this.x.px / zoomLVLs[zoomSlider.value];
        this.y.mm = this.y.px / zoomLVLs[zoomSlider.value];
    }
    
    this.updatePXdim = function() {
        // sheet size
        this.width.px = this.width.mm * zoomLVLs[zoomSlider.value];
        this.height.px = this.height.mm * zoomLVLs[zoomSlider.value];
        // margins
        this.margin.top.px = this.margin.top.mm * zoomLVLs[zoomSlider.value];
        this.margin.bottom.px = this.margin.bottom.mm * zoomLVLs[zoomSlider.value];
        this.margin.left.px = this.margin.left.mm * zoomLVLs[zoomSlider.value];
        this.margin.right.px = this.margin.right.mm * zoomLVLs[zoomSlider.value];
    }

    this.pan = function(dx, dy) {
        // return false if we do not have to pan this frame
        if(!this.highlight) { return false; }
        // return true otherwise (after panning)
        this.x.px += dx;
        this.y.px += dy;
        this.updateMMpos();
        return true;
        
    }
    
    this.rotate = function() {
        // Rotates the frame by 90° in the trigonometric sense
        
        // rotate position
        this.x.mm = this.x.mm + (this.width.mm - this.height.mm)/2;
        this.y.mm = this.y.mm + (this.height.mm - this.width.mm)/2;
        
        // rotate margins
        var top = this.margin.top.mm;
        this.margin.top.mm = this.margin.right.mm;
        this.margin.right.mm = this.margin.bottom.mm;
        this.margin.bottom.mm = this.margin.left.mm;
        this.margin.left.mm = top;
        
        // rotate dimensions
        var width = this.width.mm;
        this.width.mm = this.height.mm;
        this.height.mm = width;
        
        // convert all back to px
        this.updatePXpos();
        this.updatePXdim();
    }
    
    
    this.draw = function() {
        this.updatePXdim();
        this.updatePXpos();
        
        context.fillStyle = '#FFF';
        if(this.highlight || this.selected) { context.fillStyle = '#991523'; }
        // DRAW FRAME
        // top border
        context.fillRect(
            picture.x + this.x.px,
            picture.y + this.y.px,
            this.width.px,
            this.margin.top.px);
        // bottom border
        context.fillRect(
            picture.x + this.x.px,
            picture.y + this.y.px + this.height.px - this.margin.bottom.px,
            this.width.px,
            this.margin.bottom.px);
        // left border
        context.fillRect(
            picture.x + this.x.px,
            picture.y + this.y.px,
            this.margin.left.px,
            this.height.px);
        // right border
        context.fillRect(
            picture.x + this.x.px + this.width.px - this.margin.right.px,
            picture.y + this.y.px,
            this.margin.right.px,
            this.height.px);
        
        if(this.seethrough) {
            // draw the basic image to the center of the frame
            picture.drawWithin( 
                this.x.px + this.margin.left.px,
                this.y.px + this.margin.top.px,
                this.width.px - this.margin.left.px - this.margin.right.px,
                this.height.px - this.margin.top.px - this.margin.bottom.px);
        }
        
        // update menu according to seethrough property
        if(this.seethrough) {
            $('img#toggleseethrough_button').attr('src', 'pix/seethrough-on.png');
            $('img#toggleseethrough_button').hover(
                function() {$(this).attr('src','pix/seethrough-off-red.png');},
                function() {$(this).attr('src','pix/seethrough-on.png');});
        } else {
            $('img#toggleseethrough_button').attr('src', 'pix/seethrough-off.png');
            $('img#toggleseethrough_button').hover(
                function() {$(this).attr('src','pix/seethrough-on-red.png');},
                function() {$(this).attr('src','pix/seethrough-off.png');});
        }

        

        
    }
    
    this.over = function(x,y) {
        var isMouseOver = (
                picture.x + this.x.px <= x
                && picture.x + this.x.px + this.width.px >= x
                && picture.y + this.y.px <= y
                && picture.y + this.y.px + this.height.px >= y
            && !(
                picture.x + this.x.px + this.margin.left.px <= x
                && picture.x + this.x.px + this.width.px - this.margin.right.px >= x
                && picture.y + this.y.px + this.margin.top.px <= y
                && picture.y + this.y.px + this.height.px - this.margin.bottom.px >= y
            ));
        return isMouseOver;
            
    }

    this.toggleSeeThrough = function() {
        this.seethrough = ! this.seethrough;
    }
    
    // INIT
    
    // Integer containing the id (and rank) in the "frames" array
    this.id = id;
    
    // Boolean status of the frame. Equals true if the cursor is over it or is selected
    this.highlight = false;
    this.selected = false;
    
    // Physical characteristics of the frame in mm
    this.width = {'px': 0, 'mm': 0};
    this.height = {'px': 0, 'mm': 0};
    this.margin = {
        'top': {'px': 0, 'mm': 0}, 
        'bottom': {'px': 0, 'mm': 0}, 
        'left': {'px': 0, 'mm': 0}, 
        'right':{'px': 0, 'mm': 0}
    };
    

    if(format) {
        this.width.mm = format.width;
        this.height.mm = format.height;
        this.margin.top.mm = format.margin.top;
        this.margin.bottom.mm = format.margin.bottom;
        this.margin.left.mm = format.margin.left;
        this.margin.right.mm = format.margin.right;
        // Convert to px
        this.updatePXdim();
        // Used for printing later on
        this.sheet = format.sheet;
    }
    
    // Position of the frame with regard to the top left corner of the image
    // Initially positionned at the center of the screen
    this.x = {'px': (document.width - this.width.px)/2 - picture.x, 'mm': ''};
    this.y = {'px': (document.height - this.height.px)/2 - picture.y, 'mm': ''};
    // Convert to mm
    this.updateMMpos();

    // Does the frame shows underlying frames or not ?
    this.seethrough = false;
}

