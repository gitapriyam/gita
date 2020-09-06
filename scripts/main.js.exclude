/**
 * @author Ramesh
 */
var currentChapter;
var currentChapterAudioURL;
var currentslokaAudioURL;
var chaptersArray = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

var slokasArray = [9, 47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78, 22];
var startTimer;
var audioWindow;
function loadDoc(sloka, type) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET", "chap" + currentChapter + "/" + type + "_" + currentChapter + "_" + sloka + ".txt", false);
	xmlhttp.send();
	document.getElementById(type).innerHTML = xmlhttp.responseText;
}

function setAudioSrc(sloka) {
	currentslokaAudioURL = "chap" + currentChapter + "/" + currentChapter + "-" + sloka + ".mp3";
	var aElement = document.getElementById("slokaLink");
	if (aElement) {
		aElement.href = currentslokaAudioURL;
	}
}

function loadSlokas(value) {
	loadDoc(value, "sanskrit");
	loadDoc(value, "english");
	loadDoc(value, "meaning");
	setAudioSrc(value);
}

function stopChapterAudio() {
	var chapterAudio = document.getElementById("chapterAudio");
	if (chapterAudio) {
		chapterAudio.src = "";
	}
}

function stopSlokaAudio() {
	var slokaAudio = document.getElementById("slokaAudio");
	slokaAudio.src = "";
}

function prefixNum(input) {
	var value = input;
	if (value.length == 1) {
		value = "0" + value;
	}
	return value;
}

function parseString(input) {
	return parseInt(input);
}

function slokaChanged(combo) {
	var value = prefixNum(combo.options[combo.selectedIndex].value);
	setCookie("sloka", value);
	stopPlay();
	stopSlokaAudio();
	stopChapterAudio();
	loadSlokas(value);
}

function resetStyles(chap) {
	var ulChildren = document.getElementById("nav_menu").childNodes[1].childNodes;
	for (var i = 0; i < ulChildren.length; ) {
		var element = ulChildren[i].childNodes[1];
		element.className = "";
		i = i + 2;
	}
	document.getElementById(chap).className = "clicked";
}

function getCombo() {
	return document.getElementById("sloka");
}

function chapterChanged(chap, pageLoad) {
	stopPlay();
	enablePlayButton();
	var sloka = "01";
	var chapter = chap;

	var selectedChapter = document.getElementById(chapter);
	var selectedChapterText = selectedChapter.innerHTML;

	if (this.currentChapter == chap) {
		return;
	}

	if (pageLoad) {
		chapter = getStartChapter();
		sloka = getStartSloka();
		selectedChapter = document.getElementById(chapter);
		selectedChapterText = selectedChapter.innerHTML;
	} else {
		setCookie("chapter", chap);
		setCookie("sloka", sloka);
	}

	document.getElementById("selChapter").innerHTML = "Current Chapter is <b><i>" + selectedChapterText + "</i></b>";

	resetStyles(chapter);
	this.currentChapter = chapter;
	var combo = getCombo();

	var length = combo.options.length;
	for (var i = 0; i < length; i++) {
		combo.remove(0);
	}
	var chapterIndex = chaptersArray.indexOf(chapter);
	var numSlokas = slokasArray[chapterIndex];
	var slokaNum = parseString(sloka);
	var index = 1;
	for (var j = 1; j <= numSlokas; j++) {
		var option = document.createElement("option");
		option.text = "Sloka " + j;
		option.value = j;
		try {
			combo.add(option, null);
		} catch(error) {
			// IE only
			combo.add(option);
		}
		if (j == slokaNum) {
			index = j;
		}
	};

	combo.selectedIndex = index - 1;

	loadSlokas(sloka);

	var slokaName = "chap" + currentChapter;
	if (currentChapter == "00") {
		slokaName = "dhyanam";
	} else if (currentChapter == "19") {
		slokaName = "mahatmyam";
	}

	currentChapterAudioURL = "chap" + currentChapter + "/" + slokaName + ".mp3";
	var input = document.getElementById("chapterLink");
	if (input) {
		input.href = currentChapterAudioURL;
	}
	stopChapterAudio();
	stopSlokaAudio();
}

function playSloka() {
	stopChapterAudio();
	var slokaAudio = document.getElementById("slokaAudio");
	slokaAudio.src = currentslokaAudioURL;
	slokaAudio.play();
}

function playChapter() {
	stopSlokaAudio();
	var chapterAudio = document.getElementById("chapterAudio");
	chapterAudio.src = currentChapterAudioURL;
	chapterAudio.play();

}

function setCookie(cookieName, cookieValue) {
	var currentDate = new Date();
	currentDate.setTime(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + currentDate.toString();
	document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

function getCookie(cookieName) {
	var name = cookieName + "=";
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i].trim();
		if (cookie.indexOf(name) == 0)
			return cookie.substring(name.length, cookie.length);
	}
	return "";
}

function getStartChapter() {
	var cookieName = "chapter";
	var chapter = getCookie(cookieName);
	if (chapter == "") {
		chapter = "00";
		setCookie(cookieName, "00");
	}
	return prefixNum(chapter);
}

function getStartSloka() {
	var cookieName = "sloka";
	var sloka = getCookie(cookieName);
	if (sloka == "") {
		sloka = "01";
		setCookie(cookieName, "01");
	}
	return prefixNum(sloka);
}

function getPlayBtn() {
	return document.getElementById("startBtn");
}

function getStopBtn() {
	return document.getElementById("stopBtn");
}

function disablePlayButton() {
	var startBtn = getPlayBtn();
	if (startBtn) {
		startBtn.disabled = true;
	}
	var stopBtn = getStopBtn();
	if (stopBtn) {
		stopBtn.disabled = false;
	}
}

function enablePlayButton() {
	var startBtn = getPlayBtn();
	if (startBtn) {
		startBtn.disabled = false;
	}
	var stopBtn = getStopBtn();
	if (stopBtn) {
		stopBtn.disabled = true;
	}
}

function setNextSloka() {
	var combo = getCombo();
	var index = combo.selectedIndex;
	var chapterIndex = chaptersArray.indexOf(currentChapter);
	var numSlokas = slokasArray[chapterIndex];
	if (index + 1 < numSlokas) {
		combo.selectedIndex = index + 1;
		slokaChanged(combo);
		startPlay();
	} else {
		enablePlayButton();
	}
}

function waitForCompletion() {
	var slokaAudio = document.getElementById("slokaAudio");
	var duration = slokaAudio.duration;
	if (duration) {
		startTimer = setTimeout(function() {
			setNextSloka();
		}, duration * 1000);
	}
}

function startPlay() {
	disablePlayButton();
	playSloka();
	var delay = 1000;
	var delayCombo = document.getElementById("delayList");
	if (delayCombo) {
		delay = delayCombo.options[delayCombo.selectedIndex].value;
	}
	setTimeout(function() {
		waitForCompletion();
	}, delay);
};

function stopPlay() {
	if (startTimer) {
		stopSlokaAudio();
		clearInterval(startTimer);
		enablePlayButton();

	}
}

function redirect() {
	setTimeout(function() {
		document.location = "index.html";
	}, 5000);
}
