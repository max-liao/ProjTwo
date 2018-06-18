var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var twitter = function() {
    client.get('statuses/user_timeline',{ screen_name: 'Bobmax75999205'} , function(error, tweets, response) {
    if (!error){
        var tweetslen = tweets.length;
        for (i=0; i< 20 || i<tweets.length; i++){
            if (tweets[i]){
                log("\nTweet #" +(i+1));
                log("created at: " + tweets[i].created_at);
                log(tweets[i].text);
                console.log("\nTweet #" +(i+1));
                console.log("created at: " + tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }        
    } else {
        // console.log(error);
        throw error;
    }
    });
}
    twitter();