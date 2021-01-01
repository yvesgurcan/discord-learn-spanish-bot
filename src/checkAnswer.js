const getVocabulary = require('./getVocabulary');

module.exports = async ({ message, botData }) => {
    console.log(`Bot ongoing questions:`, botData.ongoingQuestions);

    const sanitizedMessage = message.toLowerCase();

    const onGoingQuestionAnswers = botData.ongoingQuestions.map(
        onGoingQuestion => onGoingQuestion.word[onGoingQuestion.answerIndex]
    );

    console.log(`On going question answers:`, onGoingQuestionAnswers);

    const answerIndex = onGoingQuestionAnswers.findIndex(
        onGoingQuestionAnswer => {
            return sanitizedMessage === onGoingQuestionAnswer;
        }
    );

    if (answerIndex === -1) {
        return 'Incorrecto.';
    }

    botData.ongoingQuestions = botData.ongoingQuestions.filter(
        (data, index) => index !== answerIndex
    );

    return 'Correcto!';
};
