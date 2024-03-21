/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => { //start after the document is ready
    $('.compose').on('click', composeTweet);
    $('#tweet-form').on('submit', postTweet);
});

//Functions
const composeTweet = () => { //slides down tweet form
    const $newTweet = $('.new-tweet');
    if ($newTweet.is(':visible')) {
        $newTweet.slideUp();
    } else {
        $newTweet.slideDown();
        $('#tweet-text').prop('disabled', false).focus();
    }
};

const postTweet = (event) => {
    //Prevents default from submission
    event.preventDefault();

    //hiding displayed error messages before validation
    $('#empty-message').hide();
    $('#limit-reached').hide();

    //Validating tweet form
    if (isTweetValid()) {

        //Serialise form data
        const formData = $('#tweet-form').serialize();

        //Make AJAX POST request
        $.post({ url: '/tweets/', data: formData })
            .then((response) => {
                //Handle successful response
                $('#response').html(response);
                //Reset the tweet form
                resetTweetForm();
                // Reset the character counter
                resetCharCounter();
                //call the function to load tweets
                loadTweets();
            })
            .catch((xhr, status, error) => {
                //Handle error
                alert("tweet could not be posted");
                console.log(xhr.responseText);
            });
    }
};

const loadTweets = () => {
    //clear tweet container
    $('.tweets-container').empty();
    //Make AJAX GET request
    $.get('/tweets/')
        .then(function(tweets) {
            renderTweets(tweets);
        })
        .catch(function(xhr, status, error) {
            console.log(error);
        });
};

const renderTweets = (tweets) => {
    // loops through tweets
    for (const tweet of tweets) {
        // calls createTweetElement for each tweet
        const $tweet = createTweetElement(tweet);
        // takes return value and appends it to the tweets container
        $('.tweets-container').prepend($tweet);
    }
};

const createTweetElement = (tweetObject) => {
    //Using .text() method to avoid XSS
    const $tweet = $('<article>').addClass('tweet');
    const $header = $('<header>').addClass('header');
    const $name = $('<div>').addClass('name');
    $name.append($('<img>').attr('src', tweetObject.user.avatars).attr('alt', 'User Avatar'));
    $name.append($('<span>').text(tweetObject.user.name));
    $header.append($name);
    $header.append($('<div>').append($('<span>').addClass('handle').text(tweetObject.user.handle)));
    $tweet.append($header);

    $tweet.append($('<p>').addClass('content').text(tweetObject.content.text));

    const $footer = $('<footer>').addClass('footer');
    $footer.append($('<span>').addClass('created-at').text(timeago.format(tweetObject.created_at)));
    const $icons = $('<span>').addClass('icons');
    $icons.append($('<i>').addClass('fa-solid fa-flag'));
    $icons.append('&nbsp;&nbsp;&nbsp;');
    $icons.append($('<i>').addClass('fa fa-retweet'));
    $icons.append('&nbsp;&nbsp;&nbsp;');
    $icons.append($('<i>').addClass('fa fa-heart'));
    $footer.append($icons);
    $tweet.append($footer);

    return $tweet;
};

const resetTweetForm = () => {
    $('#tweet-form')[0].reset();
};

const resetCharCounter = () => {
    const maxChars = 140;
    $('.counter').text(maxChars);
};

const isTweetValid = () => {
    const textCount = $('#tweet-text');
    const textLength = (textCount.val().trim().length);
    if (textLength === 0) {
        $('#empty-message').slideDown();
        return false;
    }
    if (textLength >= 140) {
        $('#limit-reached').slideDown();
        return false;
    }
    return true;
};

