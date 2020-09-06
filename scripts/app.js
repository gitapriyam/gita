var startTimer;

function setSidebarActive() {
    if (window.innerWidth > 767) {
        var div = $("#navBarHeader");
        var toggleController = angular.element(div).controller();
        if (!toggleController.isActive()) {
            $("#toggleButton")[0].click();
        }
    }
}

function getAudioPlayer() {
    return $("#slokaAudio")[0];
}

function getPlayBtn() {
    return $("#btnPlayOne")[0];
}

function getPlayAllBtn() {
    return $("#btnPlayAll")[0];
}


function getStopBtn() {
    return $("#btnStop")[0];
}


function getController() {
    var div = $("#slokaDiv");
    return angular.element(div).controller();
}

function stopSloka() {
    var audio = getAudioPlayer();
    audio.src = "";
}


function playOneSloka() {
    disablePlayButton();
    var audio = getAudioPlayer();
    audio.src = getController().getSlokaAudioURL();
    audio.play();
}



function waitForCompletion() {
    var slokaAudio = getAudioPlayer();
    var duration = slokaAudio.duration;
    if (duration) {
        startTimer = setTimeout(function () {
            setNextSloka();
        }, duration * 1000);
    }
}


function setNextSloka() {
    getController().incrementSloka();
    playAllSlokas();
}

function stopPlay() {
    stopSloka();
    if (startTimer) {
        clearInterval(startTimer);
    }
    enablePlayButton();
}



function disablePlayButton() {
    var playBtn = getPlayBtn();
    if (playBtn) {
        playBtn.disabled = true;
    }

    var playAllBtn = getPlayAllBtn();
    if (playAllBtn) {
        playAllBtn.disabled = true;
    }

    var stopBtn = getStopBtn();
    if (stopBtn) {
        stopBtn.disabled = false;
    }
}


function enablePlayButton() {
    var playBtn = getPlayBtn();
    if (playBtn) {
        playBtn.disabled = false;
    }

    var playAllBtn = getPlayAllBtn();
    if (playAllBtn) {
        playAllBtn.disabled = false;
    }
    var stopBtn = getStopBtn();
    if (stopBtn) {
        stopBtn.disabled = true;
    }
}


function playAllSlokas() {
    disablePlayButton();
    playOneSloka();
    var delay = 1000;

    setTimeout(function () {
        waitForCompletion();
    }, delay);
};

