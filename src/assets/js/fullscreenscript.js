var requestFullscreen = function (ele) {
	if (ele.requestFullscreen) {
		ele.requestFullscreen();
	} else if (ele.webkitRequestFullscreen) {
		ele.webkitRequestFullscreen();
	} else if (ele.mozRequestFullScreen) {
		ele.mozRequestFullScreen();
	} else if (ele.msRequestFullscreen) {
		ele.msRequestFullscreen();
	} else {
		console.log('Fullscreen API is not supported.');
	}
};

var exitFullscreen = function () {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	} else {
		console.log('Fullscreen API is not supported.');
	}
};

var fsVidButton = document.getElementById('fs-doc-button');
var fsExitDocButton = document.getElementById('fs-exit-doc-button');
var video = document.getElementById('video');

fsVidButton.addEventListener('click', function(e) {
	e.preventDefault();
	requestFullscreen(video);
	//document.getElementById("fs-doc-button").style.display = 'none';
	//document.getElementById("fs-exit-doc-button").style.display = 'block';	
});

fsExitDocButton.addEventListener('click', function(e) {
	e.preventDefault();
	exitFullscreen(video);
	//document.getElementById("fs-doc-button").style.display = 'block';
	//document.getElementById("fs-exit-doc-button").style.display = 'none';	
});


