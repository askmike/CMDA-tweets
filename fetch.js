var l = console.log
,	sql = require('/config/CMDA-tweets/sql.js')
,	twit = require('/config/CMDA-tweets/twitter.js')
,	hashtags = [ 'cmda', 'iamhva', 'hvaiam' ]

// function that stuffs a tweet into my db
,	insertTweet = function( tweet ) {
	var ts = Math.round( Date.parse( tweet.created_at ) / 1000 );
	
	sql.query(
		"INSERT IGNORE INTO `tweets` (`tweetID` ,`timestamp` ,`body` ,`source` ,`userID` ,`userName`, `fullName`) VALUES (?, ?, ?, ?, ?, ?, ?);"
	,	[ tweet.id_str, ts, tweet.text, tweet.source, tweet.user.id, tweet.user.screen_name, tweet.user.name  ]
	);
	
	l('inserted tweet from ' + tweet.user.name + ' at ' + new Date() + ' :' + tweet.text);
}

// connect to the twitter streaming api and watch for CMDA tweets

//twit.stream('statuses/filter', { track: 'cmda,iamhva,hvaiam' }, function(stream) {
twit.stream('statuses/filter', { track: hashtags.join(',') }, function(stream) {
	
	l('start watching the stream at ' + new Date());
	
	var str
	,	len = hashtags.length
	,	i;
	
	stream.on('data', function( tweet ) {
		
		str = tweet.text;
		i = len;
		
		l('new tweet from the stream: ' + str);
		
		for( ;i--; ) {
			if( str.indexOf( '#' + hashtags[i] ) !== -1 ) {
				// `insert ignore` prevents tweets being added multiple times
				insertTweet( tweet );
			}
		}	
		
	});
	stream.on('end', function(response) {
		l('disconnected');
		l(response);
	});
	stream.on('destroy', function(response) {
		l('con destroyed at ' + new Date());
		l(response);
		sql.end(); // Handle a 'silent' disconnection from Twitter, no end/error event fired
	});
});