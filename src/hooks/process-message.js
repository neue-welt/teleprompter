// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const AIMLInterpreter = require('aimlinterpreter');
const aimlInterpreter = new AIMLInterpreter({name:'AI-Curator', age:'6'});
aimlInterpreter.loadAIMLFilesIntoArray([__dirname + '/../aiml/std-65percent.aiml']);

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

    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      text,
      user: data.user,
      // Add the current date
      createdAt: new Date().getTime()
    };
    console.log(data.text);
    return aimlInterpreter.findAnswerInLoadedAIMLFiles(data.text, function(answer, wildCardArray, input) {
      // Override the original data (so that people can't submit additional stuff)
      context.data = {
        answer,
        text: data.text,
        // Add the current date
        createdAt: new Date().getTime()
      };
      console.log(answer + ' | ' + wildCardArray + ' | ' + input);

      // Best practise, hooks should always return the context
      return context;
    });
  };
};
