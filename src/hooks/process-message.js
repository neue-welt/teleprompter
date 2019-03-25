// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const fs = require('fs');
const AIMLInterpreter = require('aimlinterpreter');
const aimlInterpreter = new AIMLInterpreter({name:'AI-Curator', age:'6'});

const configs = [];
fs.readdirSync(__dirname + '/../aiml/').forEach(file => {
  configs.push(__dirname + '/../aiml/' + file);
});
aimlInterpreter.loadAIMLFilesIntoArray(configs);

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { data } = context;

    // Throw an error if we didn't get a text
    if(!data.text) {
      throw new Error('A message must have a text');
    }

    // The actual message text
    const text = context.data.text
      // Messages can't be longer than 400 characters
      .substring(0, 400);

    if(data.user === 'User') {
      try {
        return aimlInterpreter.findAnswerInLoadedAIMLFiles(text, function (answer, wildCardArray, input) {
          // Override the original data (so that people can't submit additional stuff)
          if(typeof answer === 'undefined') {
            answer = 'There was no answer';
          }
          context.data = {
            answer: answer,
            user: data.user,
            text: text,
            // Add the current date
            createdAt: new Date().getTime()
          };
          // Best practise, hooks should always return the context
          return context;
        });
      } catch (e) {
        context.data.text = text;
        context.data.createdAt = new Date().getTime();
        return context;

      }
    }  else {
      // Override the original data (so that people can't submit additional stuff)
      context.data = {
        user: data.user,
        answer: 'No answer. You are the bot',
        text: text,
        // Add the current date
        createdAt: new Date().getTime()
      };
      // Best practise, hooks should always return the context
      return context;
    }
  };
};
