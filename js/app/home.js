function setupHome() {    
    // move the whole HOME section out of the screen
    $('div#start').click(function() {
        $('section#home').animate({top: '-700px'}, 'slow', function() {
            $('section#settings').animate({left: '0px'}, 'slow');
        });
    });
}