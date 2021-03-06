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
    <div class="flex flex-column col col-6">
      <main class="chat flex flex-column flex-center flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
    <div class="flex flex-column col-6">
      <aside class="flex-1 clear realBot">
        
      </aside>
</aside>
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
  const user = message.user || 'Bot';
  const chat = $('.chat');
  const realBot = $('.realBot');
  const text = escapeHtml(message.text);
  // Escape HTML, can be removed after adding validation on defaultUsername registration.
  // const user_email = escapeHtml(defaultUsername.email);
  chat.append(`<div class="message flex flex-row">
    <div class="message-wrapper ${user}">
      <p class="message-header">
        <span class="username font-600">${user}</span>
        <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
      </p>
      <p class="message-content font-300">${text}</p>
    </div>
  </div>`);

  if(user == defaultUsername) {
    const realBotText = escapeHtml(message.answer);

    realBot.append(`<div class="message flex flex-row">
    <div class="message-wrapper ${user}">
      <p class="message-header">
        <span class="username font-600">Barbara</span>
        <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
      </p>
      <p class="message-content font-300">${realBotText}</p>
    </div>
  </div>`);
  }
  chat.scrollTop(chat[0].scrollHeight - chat[0].clientHeight);
};


// Shows the chat page
const showChat = async () => {
  $('#app').html(chatHTML);

  // Find the latest 10 messages. They will come with the newest first
  // which is why we have to reverse before adding them
  const messages = await client.service('messages').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 30
    }
  });

  messages.data.reverse().forEach(addMessage);
};

// Set up event listeners
$(document)
  .on('submit', '#send-message', async ev => {
    // This is the message text input field
    const input = $('[name="text"]');

    ev.preventDefault();

    // Create a new message and then clear the input field
    await client.service('messages').create({
      text: input.val(),
      user: 'Bot'
    });

    input.val('');
  });

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage);

// showChat();

showChat();
