This nodejs script keeps a connection open to twitter's streaming API and stores all CMDA (Communication and Multimedia Design, Amsterdam) tweets coming in. Due to not all tweets being reported, I also poll the search API.

This script is running since August 19 2012, [contact me](http://mikevanrossum.nl/) if you need tweets posted after this date.

I store the tweets in mysql (see the tweetTable) and in mongodb.