const getVocabulary = require('./getVocabulary');

const LANGUAGES = ['español', 'francés'];

module.exports = async ({ message, botData }) => {
    const vocabulary = await getVocabulary();

    const minWordIndex = 0;
    const maxWordIndex = vocabulary.length - 1;
    const randomWordIndex = Math.floor(
        Math.random() * (maxWordIndex - minWordIndex + 1) + minWordIndex
    );

    console.log(`Random vocabulary word index: ${randomWordIndex}`);

    const word = vocabulary[randomWordIndex];

    console.log(`Random word in all languages: ${word}`);

    const minTranslationindex = 0;
    const maxTranslationindex = LANGUAGES.length - 1;
    const translationIndex = Math.floor(
        Math.random() * (maxTranslationindex - minTranslationindex + 1) +
            minTranslationindex
    );

    // Does not work with more than 2 languages at the moment
    const targetTranslationIndex = translationIndex === 0 ? 1 : 0;

    const translatedWord = word[translationIndex];

    console.log(`Random vocabulary word in origin language: ${translatedWord}`);

    const targetLanguage = LANGUAGES[targetTranslationIndex];

    console.log(`Random target language: ${targetLanguage}`);

    const question = `¿Cómo se dice '${translatedWord}' en ${targetLanguage}?`;

    botData.ongoingQuestions.push({
        question,
        word,
        questionIndex: translationIndex,
        answerIndex: targetTranslationIndex
    });

    return question;
};
