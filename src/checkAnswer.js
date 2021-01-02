module.exports = async ({ message, botData }) => {
    console.log(`Bot ongoing questions:`, botData.ongoingQuestions);

    const sanitizedMessage = message.toLowerCase();

    const onGoingQuestionAnswers = botData.ongoingQuestions.map(
        onGoingQuestion => onGoingQuestion.sanitizedAnswer
    );

    console.log(`On going question answers:`, onGoingQuestionAnswers);

    const answerIndex = onGoingQuestionAnswers.findIndex(
        onGoingQuestionAnswer => {
            const correctAnswers = onGoingQuestionAnswer.filter(answer => {
                console.log(
                    'Checking for answers: ',
                    sanitizedMessage,
                    answer,
                    answer === sanitizedMessage
                );
                return answer === sanitizedMessage;
            });
            console.log('Correct answers:', correctAnswers);
            return correctAnswers.length > 0;
        }
    );

    if (answerIndex === -1) {
        return 'Incorrecto.';
    }

    console.log(`Answer index:`, answerIndex);

    botData.ongoingQuestions = botData.ongoingQuestions.filter(
        (data, index) => index !== answerIndex
    );

    return 'Correcto!';
};
