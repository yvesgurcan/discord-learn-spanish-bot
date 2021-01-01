const TAG_START = '<<<';
const TAG_END = '>>>';

const KEYWORDS = [
    {
        match: ['introduce yourself'],
        answer: {
            template: [
                `Hello! I'm ${TAG_START}botUsername${TAG_END}. How are you folks doing?`
            ]
        }
    },
    {
        match: ['hello', 'hi', 'howdy', 'hey', 'good evening', 'good morning'],
        answer: {
            template: [
                `Hello!`,
                `Hi!`,
                `How are you?`,
                `Hey ${TAG_START}author${TAG_END}!`,
                'Howdy!'
            ]
        }
    },
    {
        match: ['how are you?', 'how are you doing?'],
        answer: {
            template: [
                `I'm doing great. Thank you for asking!`,
                `I'm alright. Thanks. You?`,
                `Can't complain. I've been pretty busy lately.`
            ]
        }
    },
    {
        match: ['?'],
        answer: {
            template: [
                `Great question, ${TAG_START}author${TAG_END}!`,
                'I have no idea.',
                'What do YOU think?',
                `I'm not sure.`,
                `I'll have to think about it. Rain check?`
            ]
        }
    },
    {
        match: ['!'],
        answer: {
            template: [`Awesome!`, `I'm so excited!`, `Alright!`]
        }
    }
];



const CANNED_ANSWERS = [
    {
        template: `You're so cool, ${TAG_START}author${TAG_END}.`
    },
    {
        template: `U up?`
    },
    {
        template: 'Leto is the best.'
    },
    {
        template: "Don't you think that Leto is amazing?"
    }
];

const processMentions = message => {
    let content = message.content;
    const matches = message.content.match(/<@![0-9]{1,}>/g);
    const mentions = matches.map(mention => {
        const user = message.mentions.users.get(
            mention.replace('<@!', '').replace('>', '')
        );

        let username = undefined;
        if (user) {
            username = user.username;
            content = content.replace(mention, user.username);
        }

        return {
            tag: mention,
            value: username
        };
    });

    return { mentions, content };
};

const replaceTags = (template, context) => {
    let answer = template;
    if (template.includes(TAG_START) && template.includes(TAG_END)) {
        context.map(({ tag, value }) => {
            answer = answer.replace(tag, value);
        });
    }

    return answer;
};

module.exports = ({ message, botData }) => {
    const { content, mentions } = processMentions(message);
    console.log(`Mentions:`, mentions);
    console.log(`Processed message content:`, content);

    const context = [
        {
            tag: `${TAG_START}author${TAG_END}`,
            value: message.author.username
        },
        {
            tag: `${TAG_START}botUsername${TAG_END}`,
            value: botData.username
        }
    ];

    for (let i = 0; i < KEYWORDS.length; i++) {
        const keyword = KEYWORDS[i];

        if (
            keyword.match.some(match =>
                content.toLowerCase().includes(match.toLowerCase())
            )
        ) {
            console.log(`Keyword match:`, keyword);

            const min = 0;
            const max = keyword.answer.template.length - 1;
            const randomAnswerIndex = Math.floor(
                Math.random() * (max - min + 1) + min
            );

            console.log(`Random keyword answer index: ${randomAnswerIndex}`);

            let answer = replaceTags(
                keyword.answer.template[randomAnswerIndex],
                context
            );

            return answer;
        }
    }

    const min = 0;
    const max = CANNED_ANSWERS.length - 1;
    const randomAnswerIndex = Math.floor(Math.random() * (max - min + 1) + min);

    console.log(`Random canned answer index: ${randomAnswerIndex}`);

    let answer = replaceTags(
        CANNED_ANSWERS[randomAnswerIndex].template,
        context
    );

    return answer;
};
