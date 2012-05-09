//Version 1
var Sound = {
	ogg: false,
	mp3: false,
	wav: false,
	
	priority: ["ogg", "mp3", "wav"],
	
	onNotLoaded: function() {},
	
	get: function(name) {
		var a = new Audio();
		
		var error = function(event) {
			event.target.attemptIndex++;
			Sound.load(event.target);
		};
		
		a.addEventListener("error", error, false);
		a.attemptIndex = 0;
		a.name = name;
		Sound.load(a);
		return a;
	},
	
	load: function(audio) {
		var i = audio.attemptIndex;
		if (Sound.priority.length == i) {
			Sound.onNotLoaded();
			return;
		}
				
		if (Sound[Sound.priority[i]]) {
			audio.src = audio.name + "." + Sound.priority[i];
		} else {
			audio.attemptIndex++;
			Sound.load(audio);
		}
	},

	init: function() {
		var a = new Audio();
		Sound.ogg = a.canPlayType("audio/ogg")   != "";
		Sound.mp3 = a.canPlayType("audio/mpeg")  != "";
		Sound.wav = a.canPlayType("audio/x-wav") != "";
	}
};

Sound.init();