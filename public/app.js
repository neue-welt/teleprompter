/* global document, window, feathers, moment, io, $ */

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

const defaultUsername = 'User';

client.configure(feathers.socketio(socket));

// Chat base HTML (without defaultUsername list and messages)
const chatHTML = `<main class="flex flex-column">
  <div class="flex flex-row flex-1 clear">
    <div class="flex flex-column col col-12">
      <main class="chat flex flex-column flex-center flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1 new-message" autofocus="autofocus" autocomplete="off">
      </form>
    </div>
  </div>
</main>`;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// Renders a new message and finds the defaultUsername that belongs to the message
const addMessage = message => {
  // Find the defaultUsername belonging to this message or use the anonymous defaultUsername if not found
  const user = message.user || defaultUsername;
  const chat = $('.chat');
  const text = escapeHtml(message.text);
  // Escape HTML, can be removed after adding validation on defaultUsername registration.
  // const user_email = escapeHtml(defaultUsername.email);
  if(user === 'Bot') {
    $('body').removeClass('bot');
    chat.html(`<div class="message flex flex-row">
      <div class="message-wrapper ${user} flex flex-row">
        <p class="message-content font-500">${text}</p>
      </div>
    </div>`);
  } else if (user === 'system'){
    $('body').removeClass('bot');
    chat.html(`<div class="message flex flex-row">
      <div class="message-wrapper ${user} flex flex-row">
        <p class="message-content font-500">${text}</p>
      </div>
    </div>`);
  } else {
    $('body').addClass('bot');
    chat.html(`<div class="flex flex-column flex-center text-justify flex-1 spinner">
    </div>`);
  }

  chat.scrollTop(chat[0].scrollHeight - chat[0].clientHeight);
};

const showSystemMessage = async () => {
  $('#app').html(chatHTML);
  const system = {
    user: 'system',
    text: 'Hi, here is your AI-curator. Ask me something!'
  };
  addMessage(system);
}

// Set up event listeners
$(document)
  .on('submit', '#send-message', async ev => {
    // This is the message text input field
    const input = $('[name="text"]');

    ev.preventDefault();

    // Create a new message and then clear the input field

    await client.service('messages').create({
      text: input.val(),
      user: defaultUsername
    });

    input.val('');
  });

$('.send-message').on('keypress',function(e) {
  if(e.which == 13) {
    $(this).parent('form').submit();
  }
})
// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage);

// showChat();

showSystemMessage();
