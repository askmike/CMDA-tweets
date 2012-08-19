var l = console.log
,	sql = require('/config/CMDA-tweets/sql.js')
,	twit = require('/config/CMDA-tweets/twitter.js')


// function that stuffs a tweet into my db
,	insertTweet = function( tweet ) {
	var ts = Math.round( Date.parse( tweet.created_at ) / 1000 );
	
	sql.query(
		"INSERT INTO `tweets` (`tweetID` ,`timestamp` ,`body` ,`source` ,`userID` ,`userName`, `fullName`) VALUES (?, ?, ?, ?, ?, ?, ?);"
	,	[ tweet.id, ts, tweet.text, tweet.source, tweet.user.id, tweet.user.screen_name, tweet.user.name  ]
	);
	
	l('inserted tweet from ' + tweet.user.name + ' at ' + new Date());
}

// connect to the twitter streaming api and watch for CMDA tweets
twit.stream('statuses/filter', {track:'cmda,iamhva,hvaiam'}, function(stream) {
	stream.on('data', function(data) {
		insertTweet(data);
	});
	stream.on('end', function(response) {
		console.log('disconnected  ');
		sql.end();
	});
	stream.on('destroy', function(response) {
		console.log('disconnected  ');
		sql.end(); // Handle a 'silent' disconnection from Twitter, no end/error event fired
	});
});