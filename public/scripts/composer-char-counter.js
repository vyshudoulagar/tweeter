$(document).ready(function() {
    const textarea = $('#tweet-text');  //assign id tweet-text to textarea
    textarea.on('input', function() {   //using the event handler input 
        const textLength = $(this).val().length; //assigning the length of input to textLength
        const remaining = 140 - textLength;
        $('.counter').text(remaining);  //updating counter value as the textLength changes
        if(remaining < 0) {
            $('.counter').addClass('negative'); //add class negative to change counter value color to red when negative
        } else {
            $('.counter').removeClass('negative'); //remove class negative when counter value is positive
        }
    });
});
