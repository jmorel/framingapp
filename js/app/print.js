function printFrames(ffID) {
	//format = frameFormats[ffID];
	var w = window.open(	'', // no url specified
							'', // open in new window
							'with=150mm, border=1px solid red');
	var page = ' 							\
	<html>									\
		<head>								\
			<style>							\
				body {width: 210mm;}			\
				img {page-break-after:always}	\
			</style>						\
		</head>								\
		<body onload="window.print()">		\
			<img src="DSC_0274.jpg" style="width:110mm; height:197mm;margin: 50mm 50mm 50mm 50mm;">			\
			<img src="DSC_0274.jpg" style="width:150mm; height:257mm;margin: 10mm 20mm 30mm 40mm;">			\
		</body>								\
	</html>									';
	w.document.write(page);
}