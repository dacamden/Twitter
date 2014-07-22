// code voor week3 challenge
// the original JSON tweetLog file is created manually

// database: check http://www.postgresql.org/
// check mysql ook maar not scalable look for tutorial

// logfile rotation: every 500 entries make a new file

//client side: save boobs in database, make a database api ()

// werkwijze: node gets from twitter en puts it in database. browser vraagt info aan node server, node kan uitlezen via api (zie https://github.com/felixge/node-mysql)

var Twit = require('twit'),
	fs = require('fs'),
	http = require('http'),
	store = "tweetLog.json",
	twitTrack = 'boobs';
var T = new Twit({
	consumer_key: 'BMCZ42dOmmBsmFWSl0fAa6NLP',
	consumer_secret: 'pJTIclSS8fll7Eg1p0Ul1iA3Bdgoegba84Sqp9kHvd0ppwDFrv',
	access_token: '428111528-pa4olTbPHN19l5tLvYgRD0oE3rKGZDfokDhKvO29',
	access_token_secret: 'FSQ4kD56TWY4uqmVpSBXen0WDEicVmizLIwmcKheJBxYf'
})
var stream = T.stream('statuses/filter', {
	track: twitTrack
})
stream.on('tweet', function(raw) {
	if (raw.entities.media) {
		fs.readFile(store, function(err, data) {
			if (err) {
				console.log(err);
        return;
			}
			var tweet = { 
				name: raw.user.screen_name,
				url: raw.entities.media[0].media_url,
				date: raw.created_at
			};
      var object;
      try {
			  object = JSON.parse(data);
      } catch (e) {
        console.error("oops %s, got data %s", e, data);
        return;
      }
			object.statuses.push(tweet);
			fs.writeFile(store, JSON.stringify(object, null, 4), function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("sombody tweeted " + twitTrack);
				}
			});
		});
	}
})
http.createServer(function(request, response) {
	fs.readFile(store, function read(err, data) {
		if (err) {
			throw err;
		}
		response.writeHead(200, {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*'
		});
		response.end(data);
	})
}).listen(process.env.PORT);