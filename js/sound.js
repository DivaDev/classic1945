let SoundSystem = (function() {
    let sounds = {};

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        sounds['audio/Star_Wars_Theme_John_Williams'] = loadSound('audio/Star_Wars_Theme_John_Williams.mp3');
        console.log('Sound Initialized');
    }

    function play(sound) {
        return;

        if (!Settings.inputDispatch['SOUND'].isOn) {
            return;
        }
        
        if (sounds.hasOwnProperty(sound)) {
            sounds[sound].play();
            return;
        }

        let audio = loadSound(sound);
        audio.play();
    }

    function pause() {
        // Pause all audio
        Object.keys(sounds).forEach(function(sound) {
            sounds[sound].pause();
        });
    }

    function resume() {
        Object.keys(sounds).forEach(function(sound) {
            sounds[sound].play();
        });
    }

    loadAudio();

    return {
        play: play,
        pause: pause,
        resume: resume
    }
}());