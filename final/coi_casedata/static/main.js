// static/main.js
$(document).ready(function () {
    // Send button click handler
    $('#send_button').click(function () {
        sendMessage();
    });

    // Enter key press handler
    $('#msg_input').keypress(function (e) {
        if (e.which == 13) { // Enter key pressed
            sendMessage();
        }
    });

    // Microphone button click handler
    $('#mic_button').click(function () {
        toggleVoiceInput();
    });

    // Speech Recognition variables
    var recognition;
    var isRecording = false;

    // Initialize Speech Recognition
    function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
            return;
        }

        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            $('#msg_input').val(transcript);
            sendMessage();
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error detected: " + event.error);
            alert("Speech recognition error: " + event.error);
            $('.typing_indicator').remove();
            appendMessage("Sorry, I couldn't understand that. Please try again.", 'bot');
        };

        recognition.onend = function() {
            isRecording = false;
            $('#mic_button').removeClass('recording');
        };
    }

    // Toggle Voice Input
    function toggleVoiceInput() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            $('#mic_button').removeClass('recording');
        } else {
            recognition.start();
            isRecording = true;
            $('#mic_button').addClass('recording');
        }
    }

    // Initialize Speech Recognition on page load
    initSpeechRecognition();

    // Function to send message
    function sendMessage() {
        var userMessage = $('#msg_input').val();
        if (userMessage.trim() === '') return;

        appendMessage(userMessage, 'user');
        $('#msg_input').val(''); // Clear input field

        // Show typing indicator
        $('.messages').append('<li class="typing_indicator">Bot is typing...</li>');
        $('.messages').scrollTop($('.messages')[0].scrollHeight); // Scroll to bottom

        // AJAX request to Flask backend
        $.ajax({
            url: '/chat',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: userMessage }),
            success: function (data) {
                $('.typing_indicator').remove(); // Remove typing indicator
                appendMessage(data.response, 'bot');
                speakMessage(data.response);
            },
            error: function () {
                $('.typing_indicator').remove();
                appendMessage("Sorry, something went wrong. Please try again.", 'bot');
            }
        });
    }

    // Function to append messages to the chat window
    function appendMessage(message, type) {
        // Escape HTML to prevent XSS
        var safeMessage = $('<div>').text(message).html();
        $('.messages').append('<li class="' + type + '">' + safeMessage + '</li>');
        $('.messages').scrollTop($('.messages')[0].scrollHeight); // Scroll to the bottom
    }

    // Function to speak the bot's message
    function speakMessage(message) {
        if (!('speechSynthesis' in window)) {
            console.warn("Speech Synthesis not supported in this browser.");
            return;
        }

        var utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
});
