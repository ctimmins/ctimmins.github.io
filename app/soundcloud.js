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
				track.play({onfinish: soundcloud.playNext, volume: 0});
				soundcloud.getInfo();
			});
			SC.whenStreamingReady(function(){
				//when ready show pause button
				$('a#music_start span').removeClass('glyphicon-play').addClass('glyphicon-pause');
				//enable next/prev buttons
				$('a#music_next').removeClass('disabled');
				$('a#music_prev').removeClass('disabled');
				//bind next/prev button events
				$('a#music_next').on("click", soundcloud.playNext);
				$('a#music_prev').on("click", soundcloud.playPrev);
			});
		});

		//bind track play/pause button events
		$('#music_start').on("click", function(e){
			e.preventDefault();
			//if current track is paused
			if (soundcloud.currentTrack.paused) {
				soundcloud.currentTrack.play();
				$('a#music_start span').removeClass('glyphicon-play').addClass('glyphicon-pause');
			}
			else if (soundcloud.currentTrack.playState) {
				soundcloud.currentTrack.pause();
				$('a#music_start span').removeClass('glyphicon-pause').addClass('glyphicon-play');
			}
		});
		

		
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
			soundcloud.getInfo();
		});
		$('a#music_start span').removeClass('glyphicon-play').addClass('glyphicon-pause');
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
			soundcloud.getInfo();
		});
		$('a#music_start span').removeClass('glyphicon-play').addClass('glyphicon-pause');
	},

	getInfo: function() {
		SC.get('/tracks/'+soundcloud.set[soundcloud.currentIndex], function(track){
			$('#music_info').text(track.title);
		});
	}
}
