exports.getPercentageChangeNumberOnly = (currentNumber, prevNumber) => {
    const calc = (currentNumber - prevNumber) / prevNumber * 100
    return calc
}