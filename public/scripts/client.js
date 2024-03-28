/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(() => { //start after the document is ready
    loadTweets();
    $('.compose').on('click', composeTweet);
    $('#tweet-form').on('submit', postTweet);
    $(window).on('scroll', displayToggleButton);
    $('.top-button').on('click', goToTop);
});

//Functions
const composeTweet = () => { //slides down tweet form
    //hiding displayed error messages when hiding compose message
    $('#empty-message').hide();
    $('#limit-reached').hide();
    const $newTweet = $('.new-tweet');
    if ($newTweet.is(':visible')) {
        $newTweet.slideUp();
        // $newTweet.hide();

    } else {
        $newTweet.slideDown();
        // $newTweet.show();
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

//function to clear text area once the tweet is submitted
const resetTweetForm = () => {
    $('#tweet-form')[0].reset();
};

//function to reset counter after the tweet is submitted
const resetCharCounter = () => {
    const maxChars = 140;
    $('.counter').text(maxChars);
};

//function to check if tweet is valid
const isTweetValid = () => {
    const textCount = $('#tweet-text');
    const textLength = (textCount.val().trim().length);
    if (textLength === 0) {
        $('#empty-message').slideDown();
        return false;
    }
    if (textLength > 140) {
        $('#limit-reached').slideDown();
        return false;
    }
    return true;
};

//function to display top button when scrolled down
const displayToggleButton = () => {
    if ($(window).scrollTop() > 500) {
        $('.top-button').fadeIn();
    } else {
        $('.top-button').fadeOut();
    }
};

//function to scroll up to top and enable text area when clicked 
const goToTop = () => {
    $('html, body').animate({ scrollTop: 0 }, 500);
    $('.new-tweet').slideDown();
    $('#tweet-text').prop('disabled', false).focus();
};