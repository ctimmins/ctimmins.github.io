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
			SC.stream("/tracks/"+soundcloud.set[0], function(track){
				soundcloud.currentTrack = track;
				track.play();
			});
			SC.whenStreamingReady(function(){
				//when ready show pause button
				$('#music_start').css("background-image", "url('./libs/images/Button-Pause-icon.png')");
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
			
		})
		.on("mouseleave", function(){
		});
	},

	playNext: function() {

	},

	playPrevious: function() {

	}
}
