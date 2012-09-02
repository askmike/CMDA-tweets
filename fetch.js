var l = function( m ) {
    console.log( m );
    return m;
} 
,   sql = require( '/config/CMDA-tweets/sql.js' )
,   twit = require( '/config/CMDA-tweets/twitter.js' )
,   hashtags = [ 'cmda', 'iamhva', 'hvaiam' ]
,   _ = require( 'underscore' )


// check if tweet contains one of the hashes
,   checkTweet = function( tweet ) {
    l('checking tweet : ' + text);

    var text = tweet.text
    ,   ret;

    hashtags.forEach(function( hash ) {
        if( text.indexOf( '#' + hash ) !== -1 ) ret = tweet;
    });
    return ret;
}

// insert tweet in DB
,   insertTweet = function( tweet ) {
    if( !tweet ) return;

    var ts = Math.round( Date.parse( tweet.created_at ) / 1000 );
    sql.query(
        "INSERT IGNORE INTO `tweets` (`tweetID` ,`timestamp` ,`body` ,`source` ,`userID` ,`userName`, `fullName`) VALUES (?, ?, ?, ?, ?, ?, ?);"
    ,   [ tweet.id_str, ts, tweet.text, tweet.source, tweet.user.id, tweet.user.screen_name, tweet.user.name  ]
    );
    
    l( 'inserted tweet from ' + tweet.user.name + ' at ' + new Date() + ' :' + tweet.text );
}

,   insert = _.compose( insertTweet, checkTweet )


,   destroy = function() {
    l( 'con destroyed at ' + new Date() );
    sql.end();
};

// connect to the twitter streaming api and watch for CMDA tweets
twit.stream( 'statuses/filter', { track: hashtags.join( ',' ) }, function( stream ) {
    
    l( 'start watching the stream at ' + new Date() );
    
    stream.on( 'data', insert );
    stream.on( 'destroy', destroy );
});


