module.exports = function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
       outputSpeech: {
          type: 'PlainText',
          text: output,
       },
       card: {
          type: 'Simple',
          title: "SessionSpeechlet - " + title,
          content: "SessionSpeechlet - " + output,
       },
       reprompt: {
          outputSpeech: {
             type: 'PlainText',
             text: repromptText,
          },
       },
       shouldEndSession: shouldEndSession
    };
 }