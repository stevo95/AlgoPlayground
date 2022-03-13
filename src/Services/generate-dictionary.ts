import wordsDatabase  from 'an-array-of-english-words';

const generateWordsArr = (length: number): string[] => {
    const words = [];
    for (let i = 0; i < length; ++i) {
        const index = Math.floor(Math.random() * 275000);
        words.push(wordsDatabase[index])
    }

    return words;
}

const generateDictionary = (length: number, words: string[]): string[][] => {
    const wordsLength = words.length - 1;
    const dictionary = [];

    for (let i = 0; i < length; ++i) {
        const index1 = Math.floor(Math.random() * wordsLength);
        const index2 = Math.floor(Math.random() * wordsLength);

        dictionary.push([words[index1], words[index2]])
    }

    return dictionary;
}

const returnDictionary = (numOfWords: number, numOfPairs: number) => {
    const wordsArr = generateWordsArr(numOfWords);
    return generateDictionary(numOfPairs, wordsArr);
}

export default returnDictionary;
