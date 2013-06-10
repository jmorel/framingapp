$(window).load(function() {

	$('div#start').click(function() {
    	setupEnvironment();
    	setupSettingsPanel();
    	setupActions();

        $('section#home').animate({top: '-700px'}, 'slow', function() {
            $('section#settings').animate({left: '0px'}, 'slow');
        });
    });
});

