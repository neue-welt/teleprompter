/* global document, window, feathers, moment, io, $ */

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));

// Chat base HTML (without user list and messages)
const chatHTML = `<main class="flex flex-column">
  <div class="flex flex-row flex-1 clear">
    <div class="flex flex-column col col-12">
      <main class="chat flex flex-column flex-center flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
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


// Renders a new message and finds the user that belongs to the message
const addMessage = message => {
  // Find the user belonging to this message or use the anonymous user if not found
  const user = message.user || 'You';
  const chat = $('.chat');
  const text = escapeHtml(message.text);
  // Escape HTML, can be removed after adding validation on user registration.
  // const user_email = escapeHtml(user.email);
  if(user !== 'You') {
    chat.html(`<div class="message flex flex-row">
      <div class="message-wrapper ${user}">
        <p class="message-content font-300">${text}</p>
      </div>
    </div>`);
  } else if (user === 'system'){
    chat.html(`<div class="message flex flex-row">
      <div class="message-wrapper ${user}">
        <p class="message-content font-300">${text}</p>
      </div>
    </div>`);
  } else {
    chat.html(`<div class="flex flex-column flex-center text-justify flex-1 spinner">
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
      $limit: 1
    }
  });

  messages.data.reverse().forEach(addMessage);
};

const showSystemMessage = async () => {
  $('#app').html(chatHTML);
  const system = {
    user: 'system',
    text: 'Hi,here is a chatbot. Ask me something!'
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
      text: input.val()
    });

    input.val('');
  });

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage);

// showChat();

showSystemMessage();
