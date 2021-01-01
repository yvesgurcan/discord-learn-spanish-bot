const getVocabulary = require('./getVocabulary');

module.exports = async ({ message, botData }) => {
    console.log(`Bot ongoing questions:`, botData.ongoingQuestions);

    const sanitizedMessage = message.toLowerCase();

    const onGoingQuestions = botData.ongoingQuestions.map(
        onGoingQuestion => onGoingQuestion.sanitizedQuestion
    );

    console.log(`On going questions:`, onGoingQuestions);

    const questionIndex = onGoingQuestions.findIndex(onGoingQuestion => {
        return sanitizedMessage === onGoingQuestion;
    });

    if (questionIndex === -1) {
        return 'Question not found.';
    }

    const questionData = botData.ongoingQuestions[questionIndex];

    return questionData.word[questionData.answerIndex];
};
