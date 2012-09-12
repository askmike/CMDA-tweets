var l = function( m ) {
    console.log( m );
    return m;
}
,   hashtags = [ 'cmda', 'iamhva', 'hvaiam' ]

// libs
,   sql = require( '/config/CMDA-tweets/sql.js' )
,   twit = require( '/config/CMDA-tweets/twitter.js' )
,   _ = require( 'underscore' )

// check if tweet contains one of the hashes
,   checkTweet = function( tweet ) {
    var text = tweet.text
    ,   ret;

    hashtags.forEach(function( hash ) {
        if( text.indexOf( '#' + hash ) !== -1 ) 
            ret = tweet;
    });
    return ret;
}

,   logResult = function( err, r ) {
    if( r.insertId !== 0 )
        l( 'inserted id ' + r.insertId + ' at ' + new Date() );
}

// insert tweet in DB
,   insertTweet = function( tweet ) {
    if( !tweet ) 
        return;

    // search api provides user data different than streaming api
    tweet.user = tweet.user || {
        id: tweet.from_user_id
    ,   screen_name: tweet.from_user
    ,   name: tweet.from_user_name
    }

    var ts = Math.round( Date.parse( tweet.created_at ) / 1000 );

    sql.query(
        "INSERT IGNORE INTO `tweets` (`tweetID` ,`timestamp` ,`body` ,`source` ,`userID` ,`userName`, `fullName`) VALUES (?, ?, ?, ?, ?, ?, ?);"
    ,   [ tweet.id_str, ts, tweet.text, tweet.source, tweet.user.id, tweet.user.screen_name, tweet.user.name  ]
    ,   logResult
    );
}

,   insert = _.compose( insertTweet, checkTweet )


,   destroy = function() {
    l( 'con destroyed at ' + new Date() );
    sql.end();
}

// connect the twitter search api and fetch the 50 latest tweets
,   search = function() {
    twit.search('#cmda', { result_type: 'recent', rpp: 50 }, function(err, data) {
        if( err )
            throw err;
        if( data )
            data.results.forEach( insert );
    });
}

,   ping = function() {
    l( 'still alive at ' + new Date() );
}

,   pump = _.compose( search, ping );

// connect to the twitter streaming api and watch for CMDA tweets
twit.stream( 'statuses/filter', { track: hashtags.join( ',' ) }, function( stream ) {
    l( 'start watching the stream at ' + new Date() );
    stream.on( 'data', insert );
    stream.on( 'destroy', destroy );
});

pump();
setInterval( pump, 1000*60*5 ); // 5 min
