'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['game', 'howler'], function (game, Howler) {
  //*******************************************************************************************************************
  // ** Responsible for preloading assets
  //*******************************************************************************************************************
  var Loader = function () {
    function Loader() {
      _classCallCheck(this, Loader);

      this.remaining = 0;
      this.callback = function () {};
      this.audioExtension = this.checkOggSupport() ? '.ogg' : '.m4a';
    }

    _createClass(Loader, [{
      key: 'graphicFiles',
      value: function graphicFiles() {
        return [];
      }
    }, {
      key: 'soundFiles',
      value: function soundFiles() {
        return !game.config.loadAudio ? [] : ['attack', 'battle', 'buzzer', 'claim', 'equip', 'hit', 'pick', 'put', 'select', 'sell', 'stat', 'victory'];
      }
    }, {
      key: 'soundtrackFiles',
      value: function soundtrackFiles() {
        return !game.config.loadAudio ? [] : ['soundtrack'];
      }
    }, {
      key: 'load',
      value: function load(callback) {
        this.setCallback(callback);
        this.setRemaining();
        this.loadGraphics();
        this.loadSounds();
        this.loadSoundtracks();
      }
    }, {
      key: 'setCallback',
      value: function setCallback(callback) {
        this.callback = callback;
      }
    }, {
      key: 'setRemaining',
      value: function setRemaining() {
        this.remaining = 1 + this.soundFiles().length + this.soundtrackFiles().length;
      }
    }, {
      key: 'loadGraphics',
      value: function loadGraphics() {
        var _this = this;

        game.graphics.loadResources(function () {
          return _this.onLoad();
        });
      }
    }, {
      key: 'loadSounds',
      value: function loadSounds() {
        var _this2 = this;

        var files = this.soundFiles();
        files.forEach(function (name) {
          var path = 'assets/sounds/' + name + _this2.audioExtension;
          var audio = new Howler.Howl({
            src: [path],
            onload: function onload() {
              return _this2.onLoad();
            },
            onloaderror: function onloaderror() {
              return _this2.onError();
            },
            autoplay: false
          });
          game.audio.prepareSound(name, audio);
        });
      }
    }, {
      key: 'loadSoundtracks',
      value: function loadSoundtracks() {
        var _this3 = this;

        var files = this.soundtrackFiles();
        files.forEach(function (name) {
          var path = 'assets/soundtracks/' + name + _this3.audioExtension;
          var audio = new Howler.Howl({
            src: [path],
            onload: function onload() {
              return _this3.onLoad();
            },
            onloaderror: function onloaderror() {
              return _this3.onError();
            },
            autoplay: false
          });
          game.audio.prepareSoundtrack(audio);
        });
      }
    }, {
      key: 'onLoad',
      value: function onLoad() {
        this.remaining -= 1;
        if (this.remaining == 0) {
          this.callback();
        }
      }
    }, {
      key: 'onError',
      value: function onError() {
        console.log('Error loading asset!');
      }
    }, {
      key: 'checkOggSupport',
      value: function checkOggSupport() {
        var a = document.createElement('audio');
        return !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
      }
    }]);

    return Loader;
  }();

  return Loader;
});