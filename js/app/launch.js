$(window).load(function() {

	$('div#start').click(function() {
    	setupEnvironment();
    	setupSettingsPanel();
    	setupActions();

        $('section#home').animate({top: '-700px'}, 'slow', function() {
            $('section#settings').animate({left: '0px'}, 'slow', function() {
                // Settings are displayed, launch introjs explanations
                var intro = introJs();
                intro.setOptions({
                    steps: [
                        {
                            element: document.querySelector( '[data-introjs="step1"]' ),
                            intro: "Before we start cutting your picture, we'll need some data."
                        },
                        {
                            element: document.querySelector( '[data-introjs="step2"]' ),
                            intro: "The picture itself of course,"
                        },
                        {
                            element: document.querySelector( '[data-introjs="step3"]' ),
                            intro: "And its print size, that is the width and length of the image once printed (in mm). Don't worry, you'll be able to change it later on."
                        },
                        /*{
                            element: document.querySelector( '[data-introjs="step4"]' ),
                            intro: "We'll also need your screen resolution (in px). This is autodetected so you don't have to worry about it."
                        },*/
                        {
                            element: document.querySelector( '[data-introjs="step4"]' ),
                            intro: "Frames are nothing more than sheets of paper with a part of your image printed on it. But we'll need to define which paper sizes you want to use and which margin you'd like to have."

                        },
                        {
                            element: document.querySelector( '[data-introjs="step5"]' ),
                            intro: "Use this form to add a new frame format. Choose the paper size, set up the margins, give it a name and click on <i>ADD</i>."
                        },
                        {
                            element: document.querySelector( '[data-introjs="step6"]' ),
                            intro: "All your frame formats will be shown here. You can edit any of those, just click on the property you want to change.",
                            position: "top"
                        },
                        {
                            element: document.querySelector( '[data-introjs="step7"]' ),
                            intro: "After all this hard work, you may want to save it to your desktop. If you want to resume a previous project, just upload the saved settings here."
                        },
                        {
                            element: document.querySelector( '[data-introjs="step8"]' ),
                            intro: "When you're done, click <b>GO!</b>"
                        }
                    ]
                });
                intro.start();
            });
        });
    });
});

