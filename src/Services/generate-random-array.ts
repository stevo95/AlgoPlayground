
const generateRandomArrayOfLength = (length: number, maxValue: number) => {
    const array = [];

    for (let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * maxValue))
    }
    
    return array;
}

export default generateRandomArrayOfLength;
