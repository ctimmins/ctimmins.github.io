var soundcloud = {
	
	initialize: function() {

		SC.initialize({
			client_id: '1029053d9185536a25fcb9e86b2ee2c1'
		});

		var plist = "https://soundcloud.com/chad-timmins/sets/down-time";
		var set = [];
		SC.get('/resolve', {url: plist}, function(playlist){
			for(track in playlist.tracks)
			{
				set.push(playlist.tracks[track].id);
			}
			soundcloud.set = set;
			soundcloud.setSize = playlist.track_count;
			SC.stream("/tracks/"+soundcloud.set[0], function(track){
				soundcloud.currentTrack = track;
				soundcloud.currentIndex = 0;
				track.play({onfinish: soundcloud.playNext});
			});
			SC.whenStreamingReady(function(){
				//when ready show pause button
				$('#music_start').css("background-image", "url('./libs/images/Button-Pause-icon.png')");
				//enable next/prev buttons
				$('a#music_next').removeClass('disabled');
				$('a#music_prev').removeClass('disabled');
			});
		});

		//bind track play/pause button events
		$('#music_start').on("click", function(e){
			e.preventDefault();
			if (soundcloud.currentTrack.paused) {
				soundcloud.currentTrack.play();
				$('#music_start').css("background-image", "url('./libs/images/Button-Pause-icon.png')");
			}
			else if (soundcloud.currentTrack.playState) {
				soundcloud.currentTrack.pause();
				$('#music_start').css("background-image", "url('./libs/images/playbutton3.png')");
			}
		})
		.on("mouseenter", function(){
			$('#music_start').css("opacity", ".75");
		})
		.on("mouseleave", function(){
			$('#music_start').css("opacity", "1");
		});

		//bind next/prev button events
		$('a#music_next').on("click", soundcloud.playNext);
		$('a#music_prev').on("click", soundcloud.playPrev);
	},

	playNext: function() {
		if(++soundcloud.currentIndex >= soundcloud.setSize){
			soundcloud.currentIndex = 0;
		}
		console.log(soundcloud.currentIndex);
		SC.stream("/tracks/"+soundcloud.set[soundcloud.currentIndex], function(track){
			soundcloud.currentTrack.unload();
			soundcloud.currentTrack = track;
			track.play({onfinish: soundcloud.playNext});
			$('#music_start').css("background-image", "url('./libs/images/Button-Pause-icon.png')");
		});
	},

	playPrev: function() {
		if(--soundcloud.currentIndex < 0) {
			soundcloud.currentIndex = soundcloud.setSize - 1;
		}
		console.log(soundcloud.currentIndex);
		SC.stream("/tracks/"+soundcloud.set[soundcloud.currentIndex], function(track){
			soundcloud.currentTrack.unload();
			soundcloud.currentTrack = track;
			track.play({onfinish: soundcloud.playNext});
			$('#music_start').css("background-image", "url('./libs/images/Button-Pause-icon.png')");
		});
	}
}
