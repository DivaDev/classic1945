let SoundSystem = (function() {
    let sounds = {};

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        sounds['audio/XWing-Laser'] = loadSound('audio/XWing-Laser.wav');
        console.log('Sound Initialized');
    }

    function play(sound) {

        if (!Settings.inputDispatch['SOUND'].isOn) {
            return;
        }

        // sounds[sound].play();
        let audio = loadSound(sound);
        audio.play();
    }

    // loadAudio();

    return {
        play: play,
    }
}());