var path = require('path');
var friends = require("../.././app/data/friends.js");


module.exports = function(app) {

    //route to display all possible friends
    app.get('/api/friends', function(req, res) {
        return res.json(friends);
    });
    //route to survey
    app.post('/api/friends', function(req, res) {
        //handle incoming survey results.
        var results = req.body;

        //also conduct compatibility logic
        var match = totalDifference(friends, results);
        //here I am pushing the new entry to the friends array.
        friends.push(results);
        //now I am going to send the resulting "matched" friend back to the browser
        res.status(201).json(match);
    });
};
//this function compares scores between user and existing friends list and returns the lowest score difference.
function totalDifference(friends, results) {
    var diffAmt = [];
    var totalDiff = [];
    var diffA = 0;
    var friend = {};

    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < friends[i].scores.length; j++) {
            //this array holds the absolute vaulue of the differences in scores between our new entry and friend at index i
            diffAmt[j] = Math.abs(friends[i].scores[j] - results.scores[j]);
            //now I need to figure out how to sum up the differences for that index and hold in the totalDiff array.
            diffA += diffAmt[j];
        }
        //outside of the scores loop, this array holds the total difference for each friend comparison
        totalDiff[i] = diffA;
        //I've resett diffA to zero each time beacuse without resetting, each friend total difference was being added
        diffA = 0;
    }

    //here I am setting diffA and friend equal to the first friends comparison before starting the loop over the total array
    diffA = totalDiff[0];
    friend = friends[0];
    //this loop will determine who is the most compatible by finding the lowest difference score and saving that friends name.
    for (var i = 0; i < friends.length; i++) {
        if (totalDiff[i] < diffA) {
            diffA = totalDiff[i];
            friend = friends[i];
        }
        //diffA should be the sum difference between the user and the last person in the array, so they would be most compatible
    }
    //this is logging out the correct friend.  Now I need to get this back to the user to display in their browser.
    return friend;
}