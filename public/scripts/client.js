/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// const data = [
//     {
//         "user": {
//             "name": "Newton",
//             "avatars": "https://i.imgur.com/73hZDYK.png"
//             ,
//             "handle": "@SirIsaac"
//         },
//         "content": {
//             "text": "If I have seen further it is by standing on the shoulders of giants"
//         },
//         "created_at": 1461116232227
//     },
//     {
//         "user": {
//             "name": "Descartes",
//             "avatars": "https://i.imgur.com/nlhLi3I.png",
//             "handle": "@rd"
//         },
//         "content": {
//             "text": "Je pense , donc je suis"
//         },
//         "created_at": 1461113959088
//     }
// ];

$(document).ready(function() {
    const createTweetElement = (tweetObject) => {
        const $tweet = $(`<article class="tweet">
        <header class="header">
            <div class="name">
                <img src="${tweetObject.user.avatars}" alt="User Avatar">
                <span>${tweetObject.user.name}</span>
            </div>
            <div>
                <span class="handle">${tweetObject.user.handle}</span>
            </div>
        </header>
        <p class="content">${tweetObject.content.text}</p>
        <footer class="footer">
            <span class="created-at">${timeago.format(tweetObject.created_at)}</span>
            <span class="icons">
                <i class="fa-solid fa-flag"></i>&nbsp;&nbsp;&nbsp;
                <i class="fa fa-retweet"></i>&nbsp;&nbsp;&nbsp;
                <i class="fa fa-heart"></i>&nbsp;&nbsp;&nbsp;
            </span>
        </footer>
    </article>`);
        return $tweet;
    };

    const renderTweets = function(tweets) {
        // loops through tweets
        for (const tweet of tweets) {
            // calls createTweetElement for each tweet
            const $tweet = createTweetElement(tweet);
            // takes return value and appends it to the tweets container
            $('.tweets-container').prepend($tweet);
        }
    };

    // renderTweets(data);


$('#tweet-form').on('submit', function(event) {
    //Prevents default from submission
    event.preventDefault();

    //Serialise form data
    const formData = $(this).serialize();

    //Make AJAX POST request
    $.post({
        url: '/tweets/',
        data: formData,
        success: function(response) {
            //Handle successful response
            $('#response').html(response);
        },
        error: function(xhr, status, error) {
            //Handle error
            console.log(xhr.responseText);
        }
    })
});

const loadTweets = function() {
    //Make AJAX GET request
    $.ajax('/tweets/', {
        method: 'GET',
        success: function(tweets) {
            renderTweets(tweets);
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
};

loadTweets();

});