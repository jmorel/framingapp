function testCut() {
	
}

function setupTestCut() {

	return;

	// add frame format 1
	sheetsize = 'A4';
	format = new FrameFormat;
	format.name = 'A4 std margins';
	format.sheet = sheetsize;
	format.width = sheet_sizes[sheetsize].width;
	format.height = sheet_sizes[sheetsize].height;
	format.margin.top = 15;
	format.margin.bottom = 15;
	format.margin.left = 15;
	format.margin.right = 15;
	format.id = frameFormatsID;
	frameFormats.push(format);
	frameFormatsID++;
	// add frame format 2
	sheetsize = 'A3';
	format = new FrameFormat;
	format.name = 'A3 std margins';
	format.sheet = sheetsize;
	format.width = sheet_sizes[sheetsize].width;
	format.height = sheet_sizes[sheetsize].height;
	format.margin.top = 15;
	format.margin.bottom = 15;
	format.margin.left = 15;
	format.margin.right = 15;
	format.id = frameFormatsID;
	frameFormats.push(format);
	frameFormatsID++;
	// add frame format 3
	sheetsize = 'A5';
	format = new FrameFormat;
	format.name = 'A5 std margins';
	format.sheet = sheetsize;
	format.width = sheet_sizes[sheetsize].width;
	format.height = sheet_sizes[sheetsize].height;
	format.margin.top = 15;
	format.margin.bottom = 15;
	format.margin.left = 15;
	format.margin.right = 15;
	format.id = frameFormatsID;
	frameFormats.push(format);
	frameFormatsID++;

	// insert into the list of FrameFormats
    $('div#allFrameFormats').html(frameList4Settings());
	// insert into the app menu
	$('ul#newFrame').html(frameList4Menu());

	


	// screen size
	scale.screen.res.width = screen.width;
	scale.screen.res.height = screen.height;
	// screen diagonal
	scale.screen.diagonal = 14;

	// actual picture size
	// using the screan: 91x74cm, r = 0.81
	// image resolution used is 900 x 1135px, r=0.79
	// good values are 720 x 908 mm
	picture.setRealWidth(720);
	picture.setRealHeight(908);

	// add frames here and there

    frame = new Frame(frameID, frameFormats[0]); // A4
    frame.height.mm = 297;
    frame.width.mm = 210;
    frame.updatePXdim();
    frame.x.mm = -93.3087408880892;
    frame.y.mm = -74.4294198690155;
    frame.updatePXpos();
    frames.push(frame);
    frameID++;

	/*frame = new Frame(frameID, frameFormats[0]); // A4
    frame.height.mm = 210;
    frame.width.mm = 297;
    frame.updatePXdim();
    frame.x.mm = 21.16606986825767;
    frame.y.mm = 100.72054189954873;
    frame.updatePXpos();
    frames.push(frame);
    frameID++;
*/}